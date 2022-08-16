import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import CategoryList from "./CategoryList";
import Navi from "./Navi";
import ProductList from "./ProductList";
import alertify from "alertifyjs";
import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import CartList from "./CartList";

export default class App extends Component {
  componentDidMount() {
    this.getProducts();
  }

  state = {
    currentCategory: "",
    cart: [],
    products: [],
  };
  changeCategory = (category) => {
    this.setState({ currentCategory: category.categoryName });
    this.getProducts(category.id);
  };
  getProducts = (categoryId) => {
    let url = "http://localhost:3000/products";
    if (categoryId) {
      url += "?categoryId=" + categoryId;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => this.setState({ products: data }));
  };
  addToCart = (product) => {
    if (product.unitsInStock !== 0) {
      let newCart = this.state.cart;
      var addedItem = newCart.find((c) => c.product.id === product.id);
      if (addedItem) {
        addedItem.quantity += 1;
      } else {
        newCart.push({ product: product, quantity: 1 });
      }
      this.setState({ cart: newCart });
      alertify.success(
        `"${product.productName}" successfully added to cart `,
        1
      );
    } else {
      alertify.error(`There isn't any of "${product.productName}" product`, 1);
    }
  };
  removeFromCart = (product) => {
    let newCart = this.state.cart.filter((c) => c.product.id !== product.id);

    this.setState({ cart: newCart });
    alertify.error(`"${product.productName}" removed from cart`, 1);
  };
  render() {
    let productInfo = { title: "Product List" };
    let categoryInfo = { title: "Category List" };
    return (
      <div>
        <Container>
          <Navi cart={this.state.cart} removeFromCart={this.removeFromCart} />
          <Row>
            <Col xs="3">
              <CategoryList
                changeCategory={this.changeCategory}
                currentCategory={this.state.currentCategory}
                info={categoryInfo}
              />
            </Col>
            <Col xs="9">
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <ProductList
                      addToCart={this.addToCart}
                      products={this.state.products}
                      currentCategory={this.state.currentCategory}
                      info={productInfo}
                    />
                  }
                />
                <Route
                  exact
                  path="/cart"
                  element={
                    <CartList
                      removeFromCart={this.removeFromCart}
                      cart={this.state.cart}
                    />
                  }
                />
                <Route exact path="*" element={<NotFound />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
