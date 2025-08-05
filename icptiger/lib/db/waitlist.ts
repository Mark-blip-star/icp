// Database utility functions for waitlist operations
// Replace with your actual database connection (e.g., Prisma, Supabase, PostgreSQL client)

import { createClient } from '@/utils/supabase/server';

export interface WaitlistEntry {
  id?: number;
  email: string;
  use_case: string;
  source?: string;
  status?: 'pending' | 'invited' | 'registered';
  priority?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface WaitlistResponse {
  id: number;
  email: string;
  created_at: Date;
  position?: number;
}

export async function addToWaitlist(data: {
  email: string;
  useCase: string;
  source: string;
}): Promise<WaitlistResponse> {
  const supabase = await createClient();
  
  // Insert into waitlist
  const { data: result, error } = await supabase
    .from('waitlist')
    .insert({
      email: data.email,
      use_case: data.useCase,
      source: data.source,
    })
    .select('id, email, created_at')
    .single();
    
  if (error) {
    console.error('Database error:', error);
    throw new Error(error.message);
  }
  
  // Get position in waitlist
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .lte('created_at', result.created_at)
    .eq('status', 'pending');
  
  return {
    id: result.id,
    email: result.email,
    created_at: new Date(result.created_at),
    position: count || 1
  };
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('waitlist')
    .select('id')
    .eq('email', email)
    .limit(1)
    .single();
    
  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Database error checking email:', error);
    return false;
  }
  
  return !!data;
}

export async function getWaitlistStats(): Promise<{
  total: number;
  pending: number;
  invited: number;
  registered: number;
}> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('waitlist')
    .select('status');
    
  if (error) {
    console.error('Database error getting stats:', error);
    return { total: 0, pending: 0, invited: 0, registered: 0 };
  }
  
  const stats = data.reduce((acc, row) => {
    acc.total++;
    if (row.status === 'pending') acc.pending++;
    else if (row.status === 'invited') acc.invited++;
    else if (row.status === 'registered') acc.registered++;
    return acc;
  }, { total: 0, pending: 0, invited: 0, registered: 0 });
  
  return stats;
}

// Database connection examples for different setups:

// 1. PostgreSQL with pg library:
/*
import { Pool } from 'pg';
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});
*/

// 2. Prisma:
/*
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function addToWaitlist(data: {
  email: string;
  useCase: string;
  source: string;
}): Promise<WaitlistResponse> {
  const result = await prisma.waitlist.create({
    data: {
      email: data.email,
      use_case: data.useCase,
      source: data.source,
    },
  });
  
  const position = await prisma.waitlist.count({
    where: {
      created_at: { lte: result.created_at },
      status: 'pending'
    }
  });
  
  return {
    id: result.id,
    email: result.email,
    created_at: result.created_at,
    position
  };
}
*/

// 3. Supabase:
/*
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function addToWaitlist(data: {
  email: string;
  useCase: string;
  source: string;
}): Promise<WaitlistResponse> {
  const { data: result, error } = await supabase
    .from('waitlist')
    .insert({
      email: data.email,
      use_case: data.useCase,
      source: data.source,
    })
    .select()
    .single();
    
  if (error) throw error;
  
  const { count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .lte('created_at', result.created_at)
    .eq('status', 'pending');
  
  return {
    id: result.id,
    email: result.email,
    created_at: new Date(result.created_at),
    position: count || 0
  };
}
*/ 