import React, { useState } from 'react';
import { TextField, Button, FormLayout } from '@shopify/polaris';

const ProductForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    price: '',
    vendor: ''
  });

  const handleChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      title: '',
      image: '',
      description: '',
      price: '',
      vendor: ''
    });
  };

  return (
    <FormLayout>
      <TextField
        label="Title"
        value={formData.title}
        onChange={handleChange('title')}
      />
      <TextField
        label="Image URL"
        value={formData.image}
        onChange={handleChange('image')}
      />
      <TextField
        label="Description"
        value={formData.description}
        onChange={handleChange('description')}
      />
      <TextField
        label="Price"
        value={formData.price}
        onChange={handleChange('price')}
      />
      <TextField
        label="Vendor"
        value={formData.vendor}
        onChange={handleChange('vendor')}
      />
      <Button onClick={handleSubmit} primary>Submit</Button>
    </FormLayout>
  );
};

export default ProductForm;
