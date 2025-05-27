import AddItem from "./AddItem";
import SearchItem from "./SearchItem";
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
// import apiRequest from "./apiRequest";
import { useState, useEffect } from "react";
import apiRequest from "./apiRequest";

function App() {
  const API_URL = "http://localhost:3100/items";

  const [items, setItems] = useState([]);
  // ([{ id: 1,checked: true,item: "Item 1" },{ id: 2,checked: false,item: "Item 2"},{ id: 3,checked: false,item: "Item 3"}]);

  const [newItem, setNewitem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // console.log("Before inserted");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("Did not receive expected data");
        const listItems = await response.json();
        console.log(listItems);
        setItems(listItems);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
      }
      finally {
        setIsLoading(false);
      }
    };

    setTimeout(() => {
      (async () => await fetchItems())();
    }, 2000)
  }, []);

  // console.log("After inserted");

  // const setAndSaveItems = (newItems) => {
  //   setItems(newItems);
  // }

  const addItem = async (item) => {
    // locally storing new item
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewitem = { id, checked: false, item };
    const listItems = [...items, myNewitem];
    setItems(listItems);

    // remotely storing new item in json server
    const postOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(myNewitem)
    }
    const result = await apiRequest(API_URL, postOptions);
    if (result) setFetchError(result);
  };

  const handleCheck = async (id) => {
    // locally storing checked variable
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);

    // remotely storing checked variable in json server
    const myItem = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ checked: myItem[0].checked})
    };
    const reqUrl = `${API_URL}/${id}`;
    const result = apiRequest(reqUrl, updateOptions);

    // if (result) setFetchError(result);
  };

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const deleteOptions = { method: 'DELETE' };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);

    if (result) setFetchError(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    console.log(newItem);
    // add item
    addItem(newItem);
    setNewitem("");
  };

  return (
    <div className="App">
      <Header title="groceries list" />

      <AddItem
        newItem={newItem}
        setNewItem={setNewitem}
        handleSubmit={handleSubmit}
      />

      <SearchItem search={search} setSearch={setSearch} />

      <main>
        {isLoading && <p>Loading Items.....</p>}
        {fetchError && <p style={{ color: 'red' }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content
          items={items.filter((item) =>
            item.item.toLowerCase().includes(search.toLowerCase())
          )}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>


      <Footer length={items.length} />
    </div>
  );
}

export default App;
