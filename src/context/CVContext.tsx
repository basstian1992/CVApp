'use client';
import React, { createContext, useContext, useState } from 'react';

type PersonalData = { fullName: string; rut: string; nationality: string; militarySituation: string; address: string; };
type Experience = { id: string; company: string; position: string; startDate: string; endDate: string; description: string; };
type Education = { id: string; institution: string; degree: string; startDate: string; endDate: string; };

interface CVContextType {
  personalData: PersonalData;
  setPersonalData: React.Dispatch<React.SetStateAction<PersonalData>>;
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  educations: Education[];
  setEducations: React.Dispatch<React.SetStateAction<Education[]>>;
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [personalData, setPersonalData] = useState<PersonalData>({ fullName: '', rut: '', nationality: 'Chilena', militarySituation: 'Al día', address: '' });
  const [experiences, setExperiences] = useState<Experience[]>([{ id: '1', company: '', position: '', startDate: '', endDate: '', description: '' }]);
  const [educations, setEducations] = useState<Education[]>([{ id: '1', institution: '', degree: '', startDate: '', endDate: '' }]);
  const [skills, setSkills] = useState<string[]>([]);
  const [summary, setSummary] = useState('');

  return (
    <CVContext.Provider value={{
      personalData, setPersonalData,
      experiences, setExperiences,
      educations, setEducations,
      skills, setSkills,
      summary, setSummary
    }}>
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);
  if (!context) throw new Error('useCV must be used within CVProvider');
  return context;
}
