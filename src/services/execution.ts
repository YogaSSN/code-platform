import { ExecutionResult } from '../types';

export interface RunCodeInput {
  code: string;
  language: string;
  testCases: { input: string; expectedOutput: string }[];
  isSubmit: boolean;
}

export interface CodeExecutionService {
  runCode(input: RunCodeInput): Promise<ExecutionResult>;
}

export class MockCodeExecutionService implements CodeExecutionService {
  async runCode(input: RunCodeInput): Promise<ExecutionResult> {
    // Simulate network delay to remote judge
    const delay = input.isSubmit ? 1500 : 800;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Mock realistic logic
    const isSuccess = input.code.trim().length > 30; // very basic heuristic
    
    if (isSuccess) {
      return {
        status: "Accepted",
        runtime: Math.floor(Math.random() * 50) + 40, // 40-90ms
        memory: +(Math.random() * 10 + 35).toFixed(1), // 35-45MB
        output: input.testCases.length > 0 ? input.testCases[0].expectedOutput : "Success",
        expectedOutput: input.testCases.length > 0 ? input.testCases[0].expectedOutput : "Success",
        passedCases: input.testCases.length,
        totalCases: input.testCases.length,
      };
    } else {
      return {
        status: "Wrong Answer",
        runtime: Math.floor(Math.random() * 30) + 20,
        memory: +(Math.random() * 10 + 35).toFixed(1),
        output: "null",
        expectedOutput: input.testCases.length > 0 ? input.testCases[0].expectedOutput : "Success",
        passedCases: Math.max(0, input.testCases.length - 1),
        totalCases: input.testCases.length,
      };
    }
  }
}

export const codeExecutionService = new MockCodeExecutionService();
