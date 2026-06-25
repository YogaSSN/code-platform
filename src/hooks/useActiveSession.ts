import { useSelector } from 'react-redux';
import { RootState } from '../store';

export type SessionType = 'NONE' | 'ROOM' | 'CHALLENGE';

export const useActiveSession = () => {
  const { activeRoom } = useSelector((state: RootState) => state.room);
  const { activeChallenge } = useSelector((state: RootState) => state.challenge);

  const sessionType: SessionType = activeRoom
    ? 'ROOM'
    : activeChallenge && activeChallenge.status !== 'COMPLETED' && activeChallenge.status !== 'FORFEITED'
    ? 'CHALLENGE'
    : 'NONE';

  return {
    sessionType,
    activeRoom,
    activeChallenge,
    isBusy: sessionType !== 'NONE',
  };
};
