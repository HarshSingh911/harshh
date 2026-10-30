import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { BookedTrip } from '../data/travelData';

const TRIPS_PATH = 'trips';

/**
 * Saves a new booked trip to Firestore.
 */
export async function saveTripToFirestore(trip: BookedTrip): Promise<void> {
  const currentUid = auth.currentUser?.uid || 'guest';
  const tripId = trip.bookingId || trip.id || `TRIP-${Date.now()}`;
  const tripDoc = {
    ...trip,
    id: tripId,
    bookingId: trip.bookingId || tripId,
    userId: currentUid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!auth.currentUser) {
    return;
  }

  try {
    await setDoc(doc(db, TRIPS_PATH, tripId), tripDoc);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${TRIPS_PATH}/${tripId}`);
  }
}

/**
 * Subscribes to real-time trips for the currently authenticated user.
 */
export function subscribeToUserTrips(
  userId: string,
  onUpdate: (trips: BookedTrip[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(collection(db, TRIPS_PATH), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const trips: BookedTrip[] = [];
      snapshot.forEach((docSnap) => {
        trips.push(docSnap.data() as BookedTrip);
      });
      onUpdate(trips);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, TRIPS_PATH);
      } catch (err: any) {
        if (onError) onError(err);
      }
    }
  );
}

/**
 * Updates an existing trip status in Firestore.
 */
export async function updateTripStatusInFirestore(
  tripId: string,
  status: 'Confirmed' | 'Pending Verification' | 'Cancelled'
): Promise<void> {
  if (!auth.currentUser) return;
  try {
    await updateDoc(doc(db, TRIPS_PATH, tripId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${TRIPS_PATH}/${tripId}`);
  }
}
