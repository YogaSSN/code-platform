import * as fs from 'fs';
import * as path from 'path';
import { problems } from '../src/data/problems';

function escapeSql(str: string): string {
  if (typeof str !== 'string') return "''";
  return "'" + str.replace(/'/g, "''") + "'";
}

function escapeJson(obj: any): string {
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

function escapeArray(arr: string[]): string {
  return "ARRAY[" + arr.map(escapeSql).join(',') + "]";
}

function toUUID(id: string): string {
  // Try parsing the ID as an integer. If it works, pad it to form a UUID.
  // If not, we could hash it, but the problems have IDs '1', '2', etc.
  const num = parseInt(id);
  if (!isNaN(num)) {
    const hex = num.toString(16).padStart(32, '0');
    return `${hex.substring(0,8)}-${hex.substring(8,12)}-${hex.substring(12,16)}-${hex.substring(16,20)}-${hex.substring(20,32)}`;
  }
  // Fallback for non-numeric string IDs
  const hex2 = Buffer.from(id).toString('hex').padEnd(32, '0').slice(0, 32);
  return `${hex2.substring(0,8)}-${hex2.substring(8,12)}-${hex2.substring(12,16)}-${hex2.substring(16,20)}-${hex2.substring(20,32)}`;
}

const lines: string[] = [];
lines.push('-- AUTO GENERATED SEED SCRIPT');
lines.push('');

for (const p of problems) {
  const pId = toUUID(p.id);
  
  // Problem
  lines.push(`INSERT INTO problems (id, title, slug, difficulty, description, tags, starter_code, acceptance_rate)`);
  lines.push(`VALUES (${escapeSql(pId)}, ${escapeSql(p.title)}, ${escapeSql(p.slug)}, ${escapeSql(p.difficulty)}, ${escapeSql(p.description)}, ${escapeArray(p.tags)}, ${escapeJson(p.starterCode)}, ${p.acceptanceRate});`);
  
  // Examples
  for (const ex of p.examples) {
    lines.push(`INSERT INTO problem_examples (problem_id, input, output, explanation)`);
    lines.push(`VALUES (${escapeSql(pId)}, ${escapeSql(ex.input)}, ${escapeSql(ex.output)}, ${ex.explanation ? escapeSql(ex.explanation) : 'NULL'});`);
  }

  // Constraints
  for (const c of p.constraints) {
    lines.push(`INSERT INTO problem_constraints (problem_id, constraint_text)`);
    lines.push(`VALUES (${escapeSql(pId)}, ${escapeSql(c)});`);
  }

  // Test cases
  for (const tc of p.testCases) {
    lines.push(`INSERT INTO test_cases (problem_id, input, expected_output, hidden)`);
    lines.push(`VALUES (${escapeSql(pId)}, ${escapeSql(tc.input)}, ${escapeSql(tc.expectedOutput)}, ${tc.isHidden ? 'TRUE' : 'FALSE'});`);
  }
  lines.push('');
}

// Daily Challenge Seed (Mock)
lines.push(`-- Daily Challenges Mock`);
lines.push(`INSERT INTO daily_challenges (problem_id, date) VALUES (${escapeSql(toUUID('1'))}, CURRENT_DATE);`);

// Contests Seed (Mock)
lines.push(`-- Contests Mock`);
lines.push(`INSERT INTO contests (id, title, start_time, end_time, status) VALUES ('11111111-1111-1111-1111-111111111111', 'Weekly Contest 400', NOW() + interval '2 days', NOW() + interval '2 days 2 hours', 'Upcoming');`);

// Achievements Catalog
lines.push(`-- Generic Achievements could be managed in app logic, but let's just make sure there are some standard records if needed later.`);

fs.writeFileSync(path.join(process.cwd(), 'supabase/migrations/003_seed_data.sql'), lines.join('\n'), 'utf-8');
console.log('Seed data written to supabase/migrations/003_seed_data.sql');
