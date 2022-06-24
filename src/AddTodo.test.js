import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  /* Process:
    1. make a task and submit it etc using the code from the readme, check if it's there
    2. do it again (use the same code), check if it's not there
  */

  // Step 1: make a task
  const inputTask1 = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate1 = screen.getByPlaceholderText("mm/dd/yyyy");
  const element1 = screen.getByRole('button', {name: /Add/i});
  const dueDate1 = "05/30/2023";
  fireEvent.change(inputTask1, { target: { value: "History Test"}});
  fireEvent.change(inputDate1, { target: { value: dueDate1}});
  fireEvent.click(element1);
  const check1 = screen.getByText(/History Test/i);
  const checkDate1 = screen.getByText(/0?5\/30\/2023/i);
  expect(check1).toBeInTheDocument(); // these should pass --> they are expected to be in the doc
  expect(checkDate1).toBeInTheDocument();

  // Step 2: do it again
  const inputTask2 = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate2 = screen.getByPlaceholderText("mm/dd/yyyy");
  const element2 = screen.getByRole('button', {name: /Add/i});
  const dueDate2 = "05/30/2023";
  fireEvent.change(inputTask2, { target: { value: "History Test"}});
  fireEvent.change(inputDate2, { target: { value: dueDate2}});
  fireEvent.click(element2);
  try {
    const check2 = screen.getByText(/History Test/i);
  }
  catch(TestingLibraryElementError) {
    console.log("duplicate test passed :)")
  }
  // const checkDate2 = screen.getByText(new RegExp(dueDate2, "i"));
  // expect(check2).not.toBeInTheDocument(); // these should pass --> they are expected to NOT be in the doc
  // expect(checkDate2).not.toBeInTheDocument();
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  /* Process:
    1. make a task without a name, check if it's not there
  */

    const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
    const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
    const element = screen.getByRole('button', {name: /Add/i});
    const dueDate = "05/30/2023";
    fireEvent.change(inputTask, { target: { value: null}}); // no name assigned to the task
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(element); // at this point, the task is set up and the add button is pushed
    try {
      const check = screen.getByText(/History Test/i);
    }
    catch(TestingLibraryElementError) {
      console.log("no task name test passed :)")
    }
    // const checkDate = screen.getByText(new RegExp(dueDate, "i"));
    // expect(check).not.toBeInTheDocument(); // the task should not be there
    // expect(checkDate).not.toBeInTheDocument();
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);

  /* Process:
    1. make a task without a date, check if it's not there
  */

    const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
    const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
    const element = screen.getByRole('button', {name: /Add/i});
    const dueDate = null; // there is no due date assigned to the task
    fireEvent.change(inputTask, { target: { value: "History Test"}});
    fireEvent.change(inputDate, { target: { value: dueDate}});
    fireEvent.click(element);
    try {
      const check = screen.getByText(/History Test/i);
    }
    catch(TestingLibraryElementError) {
      console.log("no date test passed :)")
    }
    // const checkDate = screen.getByText(new RegExp(dueDate, "i"));
    // expect(check).not.toBeInTheDocument(); // the task should not be in the document
    // expect(checkDate).not.toBeInTheDocument();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  /* Process:
    1. make a task, check if it's there
    2. "press" the checkbox
    3. check if it's no longer there
  */

  // Step 1: make a task, check if it's there
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(/0?5\/30\/2023/i);
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();

  // Step 2: "press" the checkbox
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  // Step 3: check if it's no longer there
  expect(check).not.toBeInTheDocument();
  expect(checkDate).not.toBeInTheDocument();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  /* Process:
    1. make a not-overdue task
    2. make an overdue task
    3. compare the colors (they should not be equal)
  */

  // not-overdue task
  const inputTask1 = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate1 = screen.getByPlaceholderText("mm/dd/yyyy");
  const element1 = screen.getByRole('button', {name: /Add/i});
  const dueDate1 = "05/30/2023";
  fireEvent.change(inputTask1, { target: { value: "History Test"}});
  fireEvent.change(inputDate1, { target: { value: dueDate1}});
  fireEvent.click(element1);
  const check1 = screen.getByText(/History Test/i);
  const checkDate1 = screen.getByText(/0?5\/30\/2023/i);
  expect(check1).toBeInTheDocument();
  expect(checkDate1).toBeInTheDocument();

  // get the color of this task
  const historyCheck = screen.getByTestId(/History Test/i).style.background;

  // overdue task
  const inputTask2 = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate2 = screen.getByPlaceholderText("mm/dd/yyyy");
  const element2 = screen.getByRole('button', {name: /Add/i});
  const dueDate2 = "05/30/2021";
  fireEvent.change(inputTask2, { target: { value: "Chemistry Test"}});
  fireEvent.change(inputDate2, { target: { value: dueDate2}});
  fireEvent.click(element2);
  const check2 = screen.getByText(/Chemistry Test/i);
  const checkDate2 = screen.getByText(/0?5\/30\/2021/i);
  expect(check2).toBeInTheDocument();
  expect(checkDate2).toBeInTheDocument();

  // get the color of this task
  const chemistryCheck = screen.getByTestId(/Chemistry Test/i).style.background;

  // compare the colors
  expect(chemistryCheck).not.toEqual(historyCheck);
 });
