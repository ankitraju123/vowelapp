import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import {  Page, Layout, Card, Heading, Spinner, Button, AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/product', formData);
      setProducts([...products, response.data]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/product/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <AppProvider>
      <Page>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <ProductForm onSubmit={handleSubmit} />
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card sectioned>
              {loading ? (
                <Spinner accessibilityLabel="Loading products" size="large" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {products.map((product) => (
                    <Card key={product._id} sectioned style={{ margin: '10px 0' }}>
                      <p>{product.title}</p>
                      <img src={product.image} alt={product.title} style={{ width: '100px' }} />
                      <p>{product.description}</p>
                      <p>{product.price}</p>
                      <p>{product.vendor}</p>
                      <Button onClick={() => handleDelete(product._id)}>Delete</Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  );
};

export default App;
