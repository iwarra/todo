1. Array with all the lists so that we can list them all
2. When you click on the name that list is shown
3. You can edit and delete the list
4. ID is used both for DOM elements and to separate between the lists

- When we create a list it is saved in the local storage where we have an array of all list objects "Lists" : "["{list1}", "{list2}",...]"
- Each individual list is saved to the local storage as an individual object:
  {
  listId: 1,
  name: 'Groceries',
  items: [
  { itemId: 1, title: 'milk', completed: false },
  { itemId: 2, title: 'bread', completed: true }
  ]
  },

\***\* Refactoring Ideas: \*\***

- Refactor to use e.target.reset if possible to reset the element after the input is submitted

- for loop to add events to all elements

- toggle class to add/remove styles
