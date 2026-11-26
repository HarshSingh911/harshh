import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectCountrySearchMode,
  estimateInternationalRouteFareInr,
  findMatchingCountries,
  getCitiesForCountry,
  getInternationalCityRoutes,
  getPopularCountryOptions,
  getRouteFlightEstimate,
  getBudgetThresholdsForRoutes,
  filterInternationalCityRoutes,
  getDisplayLocationCode,
  hasCityOptionChanged,
  isSameCountryPair,
  toCountryCityOption,
  COUNTRY_DIRECTORY,
  MIN_BUDGET_SLIDER_INR,
  MAX_BUDGET_SLIDER_INR,
  STOPS_FILTER_OPTIONS,
  BUDGET_CATEGORY_OPTIONS,
} from './internationalFlightRoutes';

test('findMatchingCountries matches country names and common aliases', () => {
  const indiaMatches = findMatchingCountries('India');
  assert.ok(indiaMatches.length >= 1);
  assert.equal(indiaMatches[0].city, 'India');
  assert.equal(indiaMatches[0].isCountry, true);

  const ukMatches = findMatchingCountries('UK');
  assert.equal(ukMatches[0].city, 'United Kingdom');
  assert.equal(ukMatches[0].isCountry, true);

  const usaMatches = findMatchingCountries('USA');
  assert.equal(usaMatches[0].city, 'United States');

  const uaeMatches = findMatchingCountries('UAE');
  assert.equal(uaeMatches[0].city, 'United Arab Emirates');
});

test('getPopularCountryOptions returns populated country selections', () => {
  const popular = getPopularCountryOptions();
  assert.ok(popular.length >= 8);
  assert.ok(popular.every((c) => c.isCountry === true));
});

test('detectCountrySearchMode distinguishes direct, one-side country, and both-side countries', () => {
  const indiaCountry = toCountryCityOption(COUNTRY_DIRECTORY.find((c) => c.iso2 === 'IN')!);
  const japanCountry = toCountryCityOption(COUNTRY_DIRECTORY.find((c) => c.iso2 === 'JP')!);
  const delhiCity = getCitiesForCountry('India')[0];
  const londonCity = getCitiesForCountry('United Kingdom')[0];

  assert.equal(detectCountrySearchMode(delhiCity, londonCity), 'direct');
  assert.equal(detectCountrySearchMode(indiaCountry, londonCity), 'from-country-to-city');
  assert.equal(detectCountrySearchMode(delhiCity, japanCountry), 'city-to-country');
  assert.equal(detectCountrySearchMode(indiaCountry, japanCountry), 'country-to-country');
});

test('isSameCountryPair detects when both sides belong to the same country', () => {
  const indiaCountry = toCountryCityOption(COUNTRY_DIRECTORY.find((c) => c.iso2 === 'IN')!);
  const delhiCity = getCitiesForCountry('India')[0];
  const japanCountry = toCountryCityOption(COUNTRY_DIRECTORY.find((c) => c.iso2 === 'JP')!);

  assert.equal(isSameCountryPair(indiaCountry, indiaCountry), true);
  assert.equal(isSameCountryPair(indiaCountry, delhiCity), true);
  assert.equal(isSameCountryPair(indiaCountry, japanCountry), false);
});

test('getInternationalCityRoutes returns country cities sorted cheapest first with prices for Country -> City', () => {
  const londonCity = getCitiesForCountry('United Kingdom').find((c) => c.code === 'LHR')!;
  const routes = getInternationalCityRoutes({
    targetCountry: 'India',
    direction: 'departure-cities',
    counterpartCity: londonCity,
    tripType: 'one-way',
    travellers: 1,
    cabinClass: 'Economy',
  });

  assert.ok(routes.length >= 8);
  assert.equal(routes[0].isCheapest, true);
  assert.equal(routes.filter((r) => r.isCheapest).length, 1);

  for (let i = 1; i < routes.length; i++) {
    assert.ok(routes[i].lowestPriceInr >= routes[i - 1].lowestPriceInr);
  }
  assert.ok(routes.every((r) => r.city.country === 'India' && !r.city.isCountry));
  assert.ok(routes.every((r) => r.lowestPriceInr > 15000));
});

test('getInternationalCityRoutes returns arrival cities sorted cheapest first for City -> Country', () => {
  const delhiCity = getCitiesForCountry('India').find((c) => c.code === 'DEL')!;
  const routes = getInternationalCityRoutes({
    targetCountry: 'Japan',
    direction: 'arrival-cities',
    counterpartCity: delhiCity,
    tripType: 'one-way',
    travellers: 1,
    cabinClass: 'Economy',
  });

  assert.ok(routes.length >= 4);
  assert.equal(routes[0].isCheapest, true);
  assert.ok(routes.some((r) => r.city.code === 'HND'));
  assert.ok(routes.some((r) => r.city.code === 'KIX'));
});

test('Country -> Country two-step flow prices departure cities then arrival cities based on chosen departure city', () => {
  const step1Routes = getInternationalCityRoutes({
    targetCountry: 'India',
    direction: 'departure-cities',
    counterpartCountry: 'Japan',
    tripType: 'round-trip',
    travellers: 2,
    cabinClass: 'Economy',
  });

  assert.ok(step1Routes.length >= 8);
  const chosenDepartureCity = step1Routes[0].city;

  const step2Routes = getInternationalCityRoutes({
    targetCountry: 'Japan',
    direction: 'arrival-cities',
    counterpartCity: chosenDepartureCity,
    tripType: 'round-trip',
    travellers: 2,
    cabinClass: 'Economy',
  });

  assert.ok(step2Routes.length >= 4);
  assert.equal(step2Routes[0].isCheapest, true);
  // Round-trip + 2 travellers should be significantly higher than 1-way 1-traveller base fare
  const singleEstimate = estimateInternationalRouteFareInr(chosenDepartureCity.code, step2Routes[0].city.code);
  assert.ok(step2Routes[0].lowestPriceInr > singleEstimate * 2);
});

test('getRouteFlightEstimate computes realistic durations and international vs domestic pricing', () => {
  const domestic = getRouteFlightEstimate('DEL', 'BOM');
  const shortIntl = getRouteFlightEstimate('DEL', 'DXB');
  const longIntl = getRouteFlightEstimate('DEL', 'JFK');

  assert.ok(domestic.baseFareInr < shortIntl.baseFareInr);
  assert.ok(shortIntl.baseFareInr < longIntl.baseFareInr);
  assert.ok(shortIntl.durationMins < longIntl.durationMins);
  assert.match(longIntl.duration, /^\d+h \d{2}m$/);
});

test('getBudgetThresholdsForRoutes and filterInternationalCityRoutes filter accurately by budget and stops', () => {
  const londonCity = getCitiesForCountry('United Kingdom').find((c) => c.code === 'LHR')!;
  const routes = getInternationalCityRoutes({
    targetCountry: 'India',
    direction: 'departure-cities',
    counterpartCity: londonCity,
  });

  const brackets = getBudgetThresholdsForRoutes(routes);
  assert.equal(brackets[0].id, 'all');
  assert.equal(brackets[0].maxPriceInr, null);
  assert.ok(brackets.length >= 2);

  const firstCap = brackets[1].maxPriceInr!;
  const underBudget = filterInternationalCityRoutes(routes, {
    maxBudgetInr: firstCap,
    stopsFilter: 'all',
  });
  assert.ok(underBudget.length >= 1 && underBudget.length <= routes.length);
  assert.ok(underBudget.every((r) => r.lowestPriceInr <= firstCap));

  const directOnly = filterInternationalCityRoutes(routes, {
    maxBudgetInr: null,
    stopsFilter: 'direct',
  });
  assert.ok(directOnly.every((r) => r.isDirect));

  const onePlusOnly = filterInternationalCityRoutes(routes, {
    maxBudgetInr: null,
    stopsFilter: 'one-plus',
  });
  assert.ok(onePlusOnly.every((r) => !r.isDirect));

  const zeroBudget = filterInternationalCityRoutes(routes, {
    maxBudgetInr: MIN_BUDGET_SLIDER_INR,
    stopsFilter: 'all',
  });
  assert.equal(zeroBudget.length, 0);

  const oneLakhBudget = filterInternationalCityRoutes(routes, {
    maxBudgetInr: MAX_BUDGET_SLIDER_INR,
    stopsFilter: 'all',
  });
  assert.equal(oneLakhBudget.length, routes.length);

  assert.deepEqual(
    STOPS_FILTER_OPTIONS.map((o) => o.label),
    ['Any stops', 'Direct', '1+ stops']
  );

  assert.equal(BUDGET_CATEGORY_OPTIONS.length, 5);
  const midRangeBracket = BUDGET_CATEGORY_OPTIONS.find((b) => b.id === '25k-45k')!;
  const midRangeRoutes = filterInternationalCityRoutes(routes, {
    minBudgetInr: midRangeBracket.minPriceInr,
    maxBudgetInr: midRangeBracket.maxPriceInr,
    stopsFilter: 'all',
  });
  assert.ok(
    midRangeRoutes.every(
      (r) =>
        r.lowestPriceInr >= midRangeBracket.minPriceInr &&
        r.lowestPriceInr <= midRangeBracket.maxPriceInr
    )
  );
});

test('getDisplayLocationCode returns country ISO2 code for countries and airport code for cities', () => {
  const indiaCountry = toCountryCityOption(COUNTRY_DIRECTORY.find((c) => c.iso2 === 'IN')!);
  const japanCountry = toCountryCityOption(COUNTRY_DIRECTORY.find((c) => c.iso2 === 'JP')!);
  const delhiCity = getCitiesForCountry('India')[0];

  assert.equal(getDisplayLocationCode(indiaCountry), 'IN');
  assert.equal(getDisplayLocationCode(japanCountry), 'JP');
  assert.equal(getDisplayLocationCode(delhiCity), 'DEL');
  assert.equal(
    getDisplayLocationCode({ city: 'United Kingdom', country: 'United Kingdom', code: 'COUNTRY', isCountry: true }),
    'GB'
  );

  assert.equal(hasCityOptionChanged(indiaCountry, indiaCountry), false);
  assert.equal(hasCityOptionChanged(indiaCountry, japanCountry), true);
  assert.equal(hasCityOptionChanged(indiaCountry, delhiCity), true);
});
