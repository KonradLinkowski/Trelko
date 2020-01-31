(async () => {
  class StorageService {
    constructor(storage) {
      this.storage = storage;
      this.value = {};
    }

    setItem(key, value) {
      this.value[key] = value;
      this.storage.setItem(key, value);
    }

    getItem(key) {
      if (this.value[key]) {
        return this.value[key];
      }
      const item = this.storage.getItem(key);
      this.value[key] = item;
      return item;
    }
  }

  class ListService {
    constructor(storageService) {
      this.store = storageService;
      const lastId = this.store.getItem('lastId');
      this.lastId = lastId ? +lastId : 0;
      const lists = this.store.getItem('lists');
      this.lists = lists ? JSON.parse(lists) : [];
    }

    genId() {
      const l = this.lastId;
      this.lastId += 1;
      this.store.setItem('lastId', l);
      return l;
    }

    addList() {
      const newList = { id: this.genId(), name: 'new list', items: [] };
      this.lists.push(newList);
      this.store.setItem('lists', JSON.stringify(this.lists));
      return newList;
    }

    addListItem(listId) {
      const list = this.lists.find(list => list.id === listId);
      list.items.push({ id: this.genId(), name: 'new item' });
      this.store.setItem('lists', JSON.stringify(this.lists));
      return list;
    }

    getLists() {
      return this.lists;
    }

    getListItems(listId) {
      return this.lists.find(list => list.id === listId);
    }
  }

  class ListItem {
    constructor(item) {
      this.$el = document.createElement('div');
      const $span = document.createElement('span');
      $span.textContent = item.name;
    }
  }

  class List {
    constructor(data) {
      this.data = data;
      this.$el = document.createElement('div');
      const $name = document.createElement('span');
      $name.textContent = data.name;
      const $addButton = document.createElement('button');
      $addButton.textContent = 'Add item';
      $addButton.addEventListener('click', event => {
        listService.addListItem(data.id);
      });

      this.$el.appendChild($name);
      this.$el.appendChild($addButton);
      this.render();
    }

    render() {
      const sublist = document.createElement('ol');
      this.data.items.forEach(item => {
        const listItem = new ListItem(item, this);
        sublist.appendChild(listItem.$el);
      });
      this.$el.appendChild(sublist);
    }
  }

  const store = new StorageService(localStorage);
  const listService = new ListService(store);
  const $listsBox = document.querySelector('#lists-box');
  const $listsBoxButtonAdd = document.querySelector('#lists-box__button--add');

  const lists = listService.getLists();
  lists.forEach(list => {
    const newList = new List(list);
    $listsBox.appendChild(newList.$el);
  });

  $listsBoxButtonAdd.addEventListener('click', event => {
    const listData = listService.addList();
    const list = new List(listData);
    $listsBox.appendChild(list.$el);
  });
})();