import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { User } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | any | null | undefined;
  loading: boolean;
  error: Error | undefined;
  profile: any | null;
  setSimulationUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const OTP_PATIENT_STORAGE_KEY = 'otp_patient_user';

const getStoredOtpPatient = () => {
  try {
    const stored = localStorage.getItem(OTP_PATIENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);
  const [simulationUser, setSimulationUserState] = React.useState<any | null>(() => getStoredOtpPatient());
  const [profile, setProfile] = React.useState<any | null>(null);

  const setSimulationUser = React.useCallback((nextUser: any) => {
    setSimulationUserState(nextUser);

    try {
      if (nextUser?.isPatientOtpUser) {
        localStorage.setItem(OTP_PATIENT_STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(OTP_PATIENT_STORAGE_KEY);
      }
    } catch {}
  }, []);

  const effectiveUser = React.useMemo(() => {
    if (!user && !simulationUser) return null;
    
    // If we have a real user (Google Login) and a simulation persona
    if (user && simulationUser) {
      return { 
        ...user, // Maintain real technical credentials (uid, etc)
        email: simulationUser.email || user.email, 
        displayName: simulationUser.displayName || user.displayName,
        isSimulation: true,
        impersonatedUid: simulationUser.uid // Store the persona's suggested ID if needed
      };
    }
    
    // If only simulation is active (no Google Login), we have no real session
    if (simulationUser) {
      return { ...simulationUser, isSimulation: true, isGuest: true };
    }
    
    return user;
  }, [user, simulationUser]);

  useEffect(() => {
    const syncUser = async () => {
      if (effectiveUser) {
        if ((effectiveUser as any).isPatientOtpUser) {
          setProfile({
            uid: effectiveUser.uid,
            email: effectiveUser.email,
            phone: (effectiveUser as any).phone,
            displayName: effectiveUser.displayName || (effectiveUser as any).name || 'Patient',
            role: 'guest',
            createdAt: (effectiveUser as any).createdAt,
          });
          return;
        }

        try {
          // In simulation mode, we might want to check the profile for the email typed in
          const emailForProfile = effectiveUser.email;
          const isRadha = emailForProfile === 'radha@hospital.in';
          const isAdmin = emailForProfile === 'admin@globalmaa.com' || emailForProfile === 'digitalised17@gmail.com';
          
          // Use a stable UID for the profile document if it's the developer impersonating
          const profileUid = (effectiveUser as any).isSimulation ? `profile-${emailForProfile.replace(/[@.]/g, '-')}` : effectiveUser.uid;
          const userRef = doc(db, 'users', profileUid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const newProfile = {
              email: emailForProfile,
              displayName: isRadha ? 'Radhakrishnan Hospital' : (isAdmin ? 'GMAA Institutional Admin' : (effectiveUser.displayName || 'Guest User')),
              location: isRadha ? 'India' : (isAdmin ? 'London HQ' : 'Unknown'),
              role: isAdmin ? 'admin' : (isRadha ? 'vendor' : 'vendor'),
              createdAt: serverTimestamp(),
              uid: profileUid // store the profile uid in the document
            };
            
            try {
              await setDoc(userRef, newProfile);
            } catch (e) {
              console.warn("Could not save profile to Firestore (using local only):", e);
            }
            setProfile(newProfile);
          } else {
            const data = userSnap.data();
            
            // Auto-update profiles for key simulation accounts to ensure they match requested identity
            let updated = false;
            if (isRadha && (data.role !== 'vendor' || data.displayName !== 'Radhakrishnan Hospital')) {
              const updates = { role: 'vendor', displayName: 'Radhakrishnan Hospital', location: 'India' };
              try { await updateDoc(userRef, updates); } catch(e) {}
              Object.assign(data, updates);
              updated = true;
            }
            if (isAdmin && data.role !== 'admin') {
              const updates = { role: 'admin' };
              try { await updateDoc(userRef, updates); } catch(e) {}
              Object.assign(data, updates);
              updated = true;
            }
            setProfile(data);
          }
        } catch (err) {
          console.warn("Auth sync failed (simulation mode profile fallback):", err);
          setProfile({
            email: effectiveUser.email,
            displayName: effectiveUser.email.includes('radha') ? 'Radhakrishnan Hospital' : 'Institutional Admin',
            role: effectiveUser.email.includes('radha') ? 'vendor' : 'admin',
            location: 'India'
          });
        }
      } else {
        setProfile(null);
      }
    };
    
    if (!loading) {
      syncUser();
    }
  }, [effectiveUser, loading]);

  return (
    <AuthContext.Provider value={{ user: effectiveUser, loading, error, profile, setSimulationUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
