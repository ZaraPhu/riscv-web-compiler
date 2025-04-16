/* 
The purpose of this file is to implement the RISC-V runtime simulator.
It will be used to simulate the execution of RISC-V instructions which are
retrieved from the assembly editor textarea and update the state of the 
execution environment.
Author: Zara Phukan.
Creation Date: April 3, 2025.
*/

/*** Constants and Variables ***/
const assemblyEditor = document.querySelector(
  "#assembly-editor",
) as HTMLTextAreaElement | null;
const assembleButton = document.querySelector(
  "#assemble-button",
) as HTMLButtonElement | null;

// custom object for returning the status from the parser
enum ParserStatus {
  OK,
  ERR,
}

interface ParserResult {
  output: string[][];
  status: ParserStatus.OK | ParserStatus.ERR;
  errOnLines: number[];
}

/*** Functions ***/
function assembleInput(instructionList: string[]): ParserResult {
  /**
   * Processes and validates assembly instructions.
   *
   * This function parses each instruction in the provided list, splitting it into its
   * components (opcode, operands) and verifying the format and values. It checks if the
   * instruction has a valid opcode, correct number of operands, and valid register names
   * or immediate values. If any validation fails, the error status is set and the line
   * number is recorded.
   *
   * @param instructionList - Array of assembly instruction strings to validate
   * @returns ParserResult object containing processed instructions, status, and error line numbers
   */
  const parsingResult: ParserResult = {
    output: [],
    status: ParserStatus.OK,
    errOnLines: [],
  };

  // Iterate through each instruction in the provided list
  instructionList.forEach((instruction, instructionIndex) => {
    // Split the instruction into its components and remove commas
    const destructuredInstruction: string[] = instruction.split(" ").map(element => element.replace(",", ""));
    // If the instruction is empty (after splitting), mark as error
    if (destructuredInstruction.length == 0) { parsingResult.status = ParserStatus.ERR; }

    // Look up the expected format for this instruction using its opcode
    const format: OperandType[] | undefined = INSTRUCTION_TO_FORMAT.get(destructuredInstruction[0]);
    // If the opcode isn't recognized, mark as error
    if (!format) { parsingResult.status = ParserStatus.ERR; }

    // Extract just the operands (everything after the opcode)
    const operands: string[] = destructuredInstruction.slice(1);
    // Check if the number of operands matches the expected format
    if (!(operands.length == format?.length)) { parsingResult.status = ParserStatus.ERR; }

    // Validate each operand based on its expected type
    format?.forEach((expectedOperand, index) => {
      if (expectedOperand == OperandType.REGISTER) {
        // For register operands, check if it's a valid register name
        if (!Array.from(STRINGS_TO_REGISTERS.keys()).includes(operands[index])) { 
          console.log(`Operand ${operands[index]} is not a valid register.`);
          parsingResult.status = ParserStatus.ERR;
        }
      } else {
        // For immediate value operands, check if it's a valid number
        if (Number.isNaN(parseInt(operands[index]))) { 
          console.log(`Operand ${operands[index]} is not a valid immediate.`);
          parsingResult.status = ParserStatus.ERR;
        }
      }
    });

    // If any errors were found in this instruction, record its line number
    if (parsingResult.status == ParserStatus.ERR) { 
      parsingResult.errOnLines.push(instructionIndex);
    }

    // Add the processed instruction to the output regardless of validity
    parsingResult.output.push(destructuredInstruction);
  });
  return parsingResult;
}

function executeInstructions() { 
  
}

/*** Program Starting Point ***/
// Add click event listener to the assemble button
assembleButton?.addEventListener("click", () => {
  // Split the assembly editor's content into an array of instructions
  const instructionsList: string[] = assemblyEditor?.value.split("\n") || [];

  // Call the assembleInput function to validate the instructions
  // and store the result in status (true = valid, false = invalid)
  const parsingResult: ParserResult = assembleInput(instructionsList);

  // If the assembly is invalid, log which line caused the error
  if (parsingResult.status == ParserStatus.ERR) {
    console.log(`Error at line(s) ${parsingResult.errOnLines}`);
  } 

});
