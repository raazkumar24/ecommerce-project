//fileter Electronics products from the products array
import React from 'react';
import { useSelector } from 'react-redux';
import ProductList from '../../components/ProductList';
import { useGetProductsQuery } from '../../features/api/apiSlice';
import { useGetCategoriesQuery } from '../../features/api/apiSlice';
import { useGetCategoryQuery } from '../../features/api/apiSlice';
import { useParams } from 'react-router-dom';
import { useGetCategoryProductsQuery } from '../../features/api/apiSlice';

const Electronics = () => {
    const { category } = useParams();
    const { data: products, isLoading: productsLoading } = useGetCategoryProductsQuery(category);
    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
    
    if (productsLoading || categoriesLoading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
        <h1>{category}</h1>
        <ProductList products={products} />
        </div>
    );
    }

export default Electronics;