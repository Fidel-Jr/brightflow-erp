import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import InventoryStats from '../../components/inventory/InventoryStats';
import InventoryFilters from '../../components/inventory/InventoryFilters';
import InventoryTable from '../../components/inventory/InventoryTable';
import ProductModal from '../../components/inventory/ProductModal';
import ProductDetailsModal from '../../components/inventory/ProductDetailsModal';
import CategoryModal from '../../components/inventory/CategoryModal';
import { getProducts } from '../../api/product-api';
import { getCategories } from '../../api/category-api';

const Inventory = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  

  // Mock product data
  const [products, setProducts] = useState([
    
  ]);

  const fetchProducts = async () => {
        try {
          const response = await getProducts(); // or your API call
          setProducts(response.data);
          console.log('Fetched products:', response.data);
        } catch (err) {
          console.error('Failed to fetch products', err);
          // fallback mock data
          setProducts([
            
          ]);
        }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await getCategories(); // or your API call to fetch categories
      setCategories(response.data);
      console.log('Fetched categories:', response.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      // fallback mock data
      setCategories([]);
    }
  };
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setShowSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleOpenCategoryModal = () => setShowCategoryModal(true);
  const handleCloseCategoryModal = () => setShowCategoryModal(false);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleSubmit = (formData) => {
    if (modalMode === 'add') {
      const newProduct = {
        id: products.length + 1,
        ...formData,
        lastRestocked: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
    } else {
      setProducts(products.map(product => 
        product.id === selectedProduct.id 
          ? { ...product, ...formData }
          : product
      ));
    }
    handleCloseModal();
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleDuplicate = (product) => {
    const duplicatedProduct = {
      ...product,
      id: products.length + 1,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      quantity: 0
    };
    setProducts([...products, duplicatedProduct]);
  };
  

  // Filter products
  const filteredProducts = products.filter(product => {
    const productName = (product?.name ?? '').toString();
    const productSku = (product?.sku ?? '').toString();
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productSku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
                          filterCategory === 'all' || 
                          product.categoryId?.toString() === filterCategory.toString() ||
                          product.category?.id?.toString() === filterCategory.toString();
    const matchesStock = 
      filterStock === 'all' ||
      (filterStock === 'low' && product.stockQuantity <= product.reorderLevel) ||
      (filterStock === 'out' && product.stockQuantity === 0) ||
      (filterStock === 'in' && product.stockQuantity > product.reorderLevel);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStock]);

  // 3. Logic to get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the filtered list for the current page
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      <Sidebar 
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className="flex-fill d-flex flex-column overflow-hidden">
        <TopNavbar 
          setShowSidebar={setShowSidebar}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        <main className="flex-fill overflow-auto p-4">
          <Container fluid>
            {/* Header */}
            <Row className="mb-4">
              <Col>
                <h3 className="fw-bold mb-2">Inventory Management</h3>
                <p className="text-muted mb-0">Track and manage product inventory</p>
              </Col>
            </Row>

            {/* Stats Cards */}
            <InventoryStats products={products} />

            {/* Filters and Actions */}
            <InventoryFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              categories={categories}
              filterStock={filterStock}
              setFilterStock={setFilterStock}
              onAddCategory={handleOpenCategoryModal}
              onAddProduct={() => handleOpenModal('add')}
            />

            {/* Products Table */}
            <InventoryTable 
              products={currentItems} // Pass ONLY the sliced items
              totalItems={filteredProducts.length} // Pass total count for pagination math
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onEdit={(product) => handleOpenModal('edit', product)}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onViewDetails={handleViewDetails}
            />
          </Container>
        </main>
      </div>

      {/* Add/Edit Product Modal */}
      <ProductModal
        show={showModal}
        mode={modalMode}
        product={selectedProduct}
        onHide={handleCloseModal}
        onSubmit={handleSubmit}
        onSuccess={fetchProducts}
      />

      {/* Add Category Modal */}
      <CategoryModal
        show={showCategoryModal}
        onHide={handleCloseCategoryModal}
        onSuccess={fetchCategories}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        show={showDetailsModal}
        product={selectedProduct}
        onHide={() => setShowDetailsModal(false)}
        onEdit={(product) => {
          setShowDetailsModal(false);
          handleOpenModal('edit', product);
        }}
      />
    </div>
  );
};

export default Inventory;