const listNameEl = document.querySelector('#listTitleTag');
const listNameInputEl = document.querySelector('#listNameInput');
const listNameBlockEl = document.querySelector('#listNameBlock');
const addListItemBlock = document.querySelector('#addListItemBlock');
const listItemInputEl = document.querySelector('#listItemInput');
const listBlockEl = document.querySelector('#listBlock');

//Buttons and event handlers
const createListBtn = document.querySelector('#createListBtn');
createListBtn.addEventListener('click', handleCreateList);
const addListItemBtn = document.querySelector('#addListItemBtn');
addListItemBtn.addEventListener('click', handleAddingItem);

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

function handleCreateList() {
	//Get the list name from the input element, create a unique ID for it and add it to localStorage
	const listId = self.crypto.randomUUID();
	currentListId = listId;
	const listName = listNameInputEl.value;
	storeNewList(listName, listId);
	//show the list name to the user
	listNameEl.innerText = listName;
	//create a list element for our new list, add ID and append to the parent el
	const ol = document.createElement('ol');
	ol.id = `list-${listId}`;
	listBlockEl.appendChild(ol);
	//reset after use and show-hide the elements accordingly
	listNameInputEl.value = '';
	addListItemBlock.style.display = 'inline';
	listNameBlockEl.style.display = 'none';
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

function handleAddingItem() {
	const itemId = self.crypto.randomUUID();
	const newListItem = new ListItem(itemId, listItemInputEl.value);
	storeNewItem(newListItem);

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

	//Get the current list to append to
	if (currentListId) {
		const listEl = document.querySelector(`#list-${currentListId}`);

		listEl.appendChild(div);
		div.appendChild(li);
		div.appendChild(createDeleteIconElement(itemId));
	} else {
		console.error(`List with ID list-${currentListId} not found`);
	}

	listItemInputEl.value = '';
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
	const div = document.querySelector('.listItemWrapper');
	div.remove();
}
