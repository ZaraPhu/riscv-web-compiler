"use strict";
/*
The purpose of this file is to describe the behaviour of the RISC-V
Runtime Assmebler. This file will be compiled to a .js file by the
tsc compiler. The .js file will be used by the linked to the index.html file.
Author: Zara Phukan (https://github.com/ZaraPhu).
Creation Date: April 2, 2025.
*/
/*** Constants and Variables ***/
// initial runtime simulator constants for setup
const XLEN = 32; // going to implement R32I first
// used to handle dark mode
const htmlRootNode = document.querySelector("html");
const darkModeButton = document.querySelector("#toggle-dark-mode");
let darkModeEnabled = false;
// used to populate the register list
const registerList = document.querySelector("#register-list");
/*** Functions ***/
function createRegister(index) {
    /* This function creates a new register element with the given index
     */
    const newRegister = document.createElement("li");
    newRegister.classList.add("list-group-item");
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("d-flex", "justify-content-between", "align-items-center");
    const registerName = document.createElement("p");
    registerName.classList.add("px-2", "fs-6");
    const registerValue = document.createElement("p");
    registerValue.textContent = "0x00000000";
    registerValue.classList.add("px-2", "fs-6");
    if (index < XLEN) {
        registerName.textContent = `x${index}`;
        registerValue.setAttribute("id", `x${index}-register`);
    }
    else if (index == XLEN) {
        registerName.textContent = "pc";
        registerValue.setAttribute("id", "pc-register");
    }
    else {
        registerName.textContent = "ERROR";
        registerValue.setAttribute("id", "error");
    }
    innerDiv.appendChild(registerName);
    innerDiv.appendChild(registerValue);
    newRegister.appendChild(innerDiv);
    return newRegister;
}
function populateRegisterList() {
    for (let i = 0; i < XLEN + 1; i++) {
        let newRegister = createRegister(i);
        registerList === null || registerList === void 0 ? void 0 : registerList.appendChild(newRegister);
    }
}
/*** Program Starting Point */
// sets up the dark mode toggle button
darkModeButton === null || darkModeButton === void 0 ? void 0 : darkModeButton.addEventListener("click", () => {
    darkModeEnabled = !darkModeEnabled;
    if (darkModeEnabled) {
        htmlRootNode.setAttribute("data-bs-theme", "dark");
    }
    else {
        htmlRootNode.setAttribute("data-bs-theme", "light");
    }
});
// sets up the register list and populates it
populateRegisterList();
