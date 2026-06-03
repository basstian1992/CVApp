'use client';
import React, { createContext, useContext, useState } from 'react';

export type Theme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  textDark: string;
  textLight: string;
  bgLight: string;
};

export const THEMES: Theme[] = [
  { id: 'blue', name: 'Azul Ejecutivo', primary: '#2563eb', secondary: '#1d4ed8', textDark: '#111827', textLight: '#4b5563', bgLight: '#f3f4f6' },
  { id: 'emerald', name: 'Verde Botánico', primary: '#059669', secondary: '#047857', textDark: '#064e3b', textLight: '#065f46', bgLight: '#d1fae5' },
  { id: 'gray', name: 'Gris Monocromo', primary: '#4b5563', secondary: '#374151', textDark: '#1f2937', textLight: '#6b7280', bgLight: '#f3f4f6' },
  { id: 'terracotta', name: 'Terracota Moderno', primary: '#b45309', secondary: '#92400e', textDark: '#451a03', textLight: '#78350f', bgLight: '#fef3c7' },
  { id: 'navy', name: 'Azul Nocturno', primary: '#1e3a8a', secondary: '#172554', textDark: '#0f172a', textLight: '#334155', bgLight: '#f1f5f9' },
];

type PersonalData = { fullName: string; rut: string; nationality: string; militarySituation: string; address: string; photo: string | null; };
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
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [personalData, setPersonalData] = useState<PersonalData>({ fullName: '', rut: '', nationality: 'Chilena', militarySituation: 'Al día', address: '', photo: null });
  const [experiences, setExperiences] = useState<Experience[]>([{ id: '1', company: '', position: '', startDate: '', endDate: '', description: '' }]);
  const [educations, setEducations] = useState<Education[]>([{ id: '1', institution: '', degree: '', startDate: '', endDate: '' }]);
  const [skills, setSkills] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [theme, setTheme] = useState<Theme>(THEMES[0]);

  return (
    <CVContext.Provider value={{
      personalData, setPersonalData,
      experiences, setExperiences,
      educations, setEducations,
      skills, setSkills,
      summary, setSummary,
      theme, setTheme
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
