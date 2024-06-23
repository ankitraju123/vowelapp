import React, { useState, useEffect } from 'react';
import { AppProvider, Page, Layout, Card, Spinner, Button, TextField, FormLayout } from '@shopify/polaris';
import axios from 'axios';
import ProductForm from './ProductForm';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    price: '',
    vendor: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from backend when component mounts
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

  const handleChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        // Update existing product
        const response = await axios.put(`http://localhost:8000/api/product/${editingProduct._id}`, formData);
        setProducts(products.map((product) => (product._id === editingProduct._id ? response.data : product)));
        setEditingProduct(null);
      } else {
        // Add new product
        const response = await axios.post('http://localhost:8000/api/product', formData);
        setProducts([...products, response.data]);
      }
      setFormData({
        title: '',
        image: '',
        description: '',
        price: '',
        vendor: ''
      });
    } catch (error) {
      console.error('Error submitting product:', error);
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

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      image: product.image,
      description: product.description,
      price: product.price,
      vendor: product.vendor
    });
  };

  return (
    <AppProvider i18n={{}}>
      <Page>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <FormLayout>
                <TextField label="Title" value={formData.title} onChange={handleChange('title')} />
                <TextField label="Image URL" value={formData.image} onChange={handleChange('image')} />
                <TextField label="Description" value={formData.description} onChange={handleChange('description')} />
                <TextField label="Price" value={formData.price} onChange={handleChange('price')} />
                <TextField label="Vendor" value={formData.vendor} onChange={handleChange('vendor')} />
                <Button onClick={handleSubmit} primary>
                  {editingProduct ? 'Update' : 'Submit'}
                </Button>
              </FormLayout>
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
                      <h2>{product.title}</h2>
                      <img src={product.image} alt={product.title} style={{ width: '100px' }} />
                      <p>{product.description}</p>
                      <p>{product.price}</p>
                      <p>{product.vendor}</p>
                      <Button onClick={() => handleEdit(product)}>Edit</Button>
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
