import ItemList from './ItemList';

const Content = ({ items, handleCheck, handleDelete }) => {
  // const [name, setName] = useState("Jayaram");
  // const [count, setCount] = useState(0);

  return (
    <>
        {items.length ? (
          <ItemList
            items = {items}
            handleCheck = {handleCheck}
            handleDelete = {handleDelete}
          />
        ):
        (
          <p>Grocery Items are emtpy</p>
        )}
    </>
  )
}

export default Content
