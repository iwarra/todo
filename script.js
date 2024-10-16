//Select all needed elements
const listNameEl = document.querySelector('#listTitleTag');
const listNameInputEl = document.querySelector('#listNameInput');
const listNameBlockEl = document.querySelector('#listNameBlock');
const addListItemBlock = document.querySelector('#addListItemBlock');
const listItemInputEl = document.querySelector('#listItemInput');
const listBlockEl = document.querySelector('#listBlock');
const listNameErrorEl = document.querySelector('#listNameError');
const listItemErrorEl = document.querySelector('#listItemError');

//Buttons, inputs and event handlers
const createListBtn = document.querySelector('#createListBtn');
createListBtn.addEventListener('click', handleCreateList);
const addListItemBtn = document.querySelector('#addListItemBtn');
addListItemBtn.addEventListener('click', handleAddingItem);
// Add list/item when user presses enter instead of clicking on a button
listNameInputEl.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		handleCreateList();
	}
});
listItemInputEl.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		handleAddingItem();
	}
});

//Not good to have in global
let currentListId = null;
//When and where to we create the initial one
localStorage.setItem('AllLists', JSON.stringify({ lists: [] }));

function saveDataToLocalStorage(name, data) {
	localStorage.setItem(name, JSON.stringify(data));
}

function getDataFromLocalStorage(name) {
	const data = localStorage.getItem(name);
	return data ? JSON.parse(data) : { lists: [] };
	//use if list is empty check later on if needed
}

function storeNewList(listName, id) {
	let data = getDataFromLocalStorage('AllLists');
	const newList = {
		id,
		name: listName,
		items: [],
	};
	data.lists.push(newList);
	saveDataToLocalStorage('AllLists', data);
}

function storeNewItem(item) {
	//get from storage, update and save again
	const data = getDataFromLocalStorage('AllLists');
	let currentList = data.lists.find((list) => list.id == currentListId);
	currentList.items.push(item);
	saveDataToLocalStorage('AllLists', data);
}

function ListItem(id, item) {
	this.id = id;
	this.item = item;
	this.done = false;
}

function generateId() {
	return self.crypto.randomUUID();
}

function resetInput(element) {
	element.value = '';
}

function createNewList(listName) {
	const listId = generateId();
	currentListId = listId; // Update global currentListId
	storeNewList(listName, listId);
}

function updateUIAfterListCreation(listId, listName) {
	listNameEl.innerText = listName; // Show the list name to the user

	// Create a list element for the new list, add ID, and append to the parent element
	const ol = document.createElement('ol');
	ol.id = `list-${listId}`;
	listBlockEl.appendChild(ol);

	// Toggle visibility for the list name block and item input block
	listNameBlockEl.classList.toggle('d-none');
	addListItemBlock.classList.toggle('d-none');
}

function handleCreateList() {
	if (!validateInput(listNameInputEl, listNameErrorEl)) return;
	const listName = listNameInputEl.value;
	createNewList(listName);
	updateUIAfterListCreation(currentListId, listName);
	resetInput(listNameInputEl);
}

function toggleTaskStatus(itemId) {
	const data = getDataFromLocalStorage('AllLists');
	let currentList = data.lists.find((list) => list.id == currentListId);
	let itemToUpdate = currentList.items.find((item) => item.id == itemId);
	if (itemToUpdate) {
		if (itemToUpdate.done == false) itemToUpdate.done = true;
		else itemToUpdate.done = false;
	}
	saveDataToLocalStorage('AllLists', data);
}

function createNewListItem(itemText) {
	const itemId = generateId();
	const newListItem = new ListItem(itemId, itemText);
	storeNewItem(newListItem);
	return itemId; // Return the new item ID for further use
}

function updateUIAfterAddingItem(itemId, itemText) {
	//Div wrapper for styling (later used for easier removal)
	const div = document.createElement('div');
	div.className = 'listItemWrapper';
	//Create li for the list item
	const li = document.createElement('li');
	li.id = `item-${itemId}`;
	li.addEventListener('click', () => {
		li.classList.toggle('strikethrough');
		toggleTaskStatus(itemId);
	});
	li.innerText = listItemInputEl.value;
	li.style.cursor = 'pointer';

	//Get the current list to append to
	if (currentListId) {
		const listEl = document.querySelector(`#list-${currentListId}`);

		listEl.appendChild(div);
		div.appendChild(li);
		div.appendChild(createDeleteIconElement(itemId));
	} else {
		console.error(`List with ID list-${currentListId} not found`);
	}
}

function handleAddingItem() {
	if (!validateInput(listItemInputEl, listItemErrorEl)) return;
	const itemText = listItemInputEl.value;
	const itemId = createNewListItem(itemText);
	updateUIAfterAddingItem(itemId, itemText);
	resetInput(listItemInputEl);
}

function createDeleteIconElement(itemId) {
	const deleteIcon = document.createElement('i');
	deleteIcon.className = 'material-icons';
	deleteIcon.innerText = 'delete';
	deleteIcon.style.cursor = 'pointer';

	deleteIcon.addEventListener('click', () => handleDeleteItem(itemId));
	return deleteIcon;
}

function handleDeleteItem(itemId) {
	const data = getDataFromLocalStorage('AllLists');
	let currentList = data.lists.find((list) => list.id === currentListId);
	currentList.items = currentList.items.filter((item) => item.id !== itemId);
	saveDataToLocalStorage('AllLists', data);

	const itemToDelete = document.querySelector(`#item-${itemId}`);
	if (itemToDelete && itemToDelete.parentElement) {
		itemToDelete.parentElement.remove();
	}
}

function validateInput(inputEl, messageEl, minLength = 2) {
	const value = inputEl.value.trim(); // Get the input value and remove extra spaces
	messageEl.innerText = ''; // Clear previous error messages

	if (value.length < minLength) {
		messageEl.innerText = `Input must be at least ${minLength} characters long.`; // Set error message
		return false;
	}

	return true;
}
