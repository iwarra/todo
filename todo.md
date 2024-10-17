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

**_ To Do _**

- Refactor and use objects and methods instead of functions

- Split logic into separate files

- Build further the possibility to add and delete lists

- Page to show all the lists

- Option to style different lists differently

- Option to mark all tasks as done/not done
