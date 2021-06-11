import { useEffect, useState } from "react";
import { http } from "./db/config";
import * as S from "./App.styles";
import { v4 as uuidv4 } from "uuid";

export const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await http("/products").then((products) => setProducts(products.data));
    };

    fetchData();
  }, []);

  const handleRegisterClick = (e) => {
    const description = e.currentTarget.previousElementSibling.value;
    console.log(description);

    http.post("/products", { id: uuidv4(), description });

    const getProducts = async () => {
      await http("/products").then((resp) => {
        const { data } = resp;
        setProducts([...data]);
      });
    };

    getProducts().then();
  };

  const handleDeleteClick = async (e) => {
    const id = e.currentTarget.id;
    await http.delete(`/products/${id}`);
    const getProducts = http("/products").then((products) => products);
    console.log(getProducts());
  };

  return (
    <S.Container>
      <header>
        <h1>Cadastrar produto</h1>
      </header>
      <main>
        <label htmlFor="description">descrição</label>
        <input name="description" type="text" />
        <button onClick={handleRegisterClick}>cadastrar</button>
        <hr />
        <h1>Produtos Cadastrados</h1>
        {JSON.stringify(products)}
        {products ? (
          products.map((product) => (
            <S.ProductGroup key={product.id}>
              <p>Description: {product.description}</p>
              <S.DeleteButton onClick={handleDeleteClick} id={product.id}>
                deletar
              </S.DeleteButton>
            </S.ProductGroup>
          ))
        ) : (
          <h1>Nenhum produto cadastrado</h1>
        )}
      </main>
    </S.Container>
  );
};
