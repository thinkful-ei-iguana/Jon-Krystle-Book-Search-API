import React, { Component } from 'react';

import Search from './components/Search'
import ShowBook from './components/ShowBook'

class App extends Component {

  state = {
    results: [],
    value: "",
    'book-select': "all",
    'display-select':"",
    error: null
  }

  handleSearch = async (error) => {
    error.preventDefault();
    if (this.state.value.trim()===""){
      this.setState({error: 'Please enter a search term!',
      results:[],
    })
    } else {
      let filter ='';
      if (this.state['display-select'])
        filter = `&filter=${this.state['display-select']}`;

      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${this.state.value}${filter}&printType=${this.state['book-select']}`)

      if (!res.ok){
        this.setState({
          error: "Problem loading data from server. Please try again later."
        })
        return;
      }
        const resJson = await res.json()

        if (resJson.totalItems === 0){
          this.setState({
            results:[],
            error: 'No Results'
          })
        } else {
        this.setState({
          error: null,
          results: resJson.items.map(book=>({        
            authors: book.volumeInfo.authors,
            title: book.volumeInfo.title,
            price: ('retailPrice' in book.saleInfo) ? book.saleInfo.retailPrice.amount : '',
            preview: book.volumeInfo.previewLink,
            description: book.volumeInfo.description ? book.volumeInfo.description.substring(0,100) + '...' : '',
            image: book.volumeInfo.imageLinks.thumbnail
          })
          )
        })
      }   
    }
  }

  errorHandle = (response) => {
    const error = {};
    
    if (response.headers.get('content') !=='application/json'){
      error.message = response.text()
    }
  }
  
  handleSearchTerm = (error) =>{
    const {value} = error.target
    this.setState({value})
  }

  handleSelectTerm = (error) =>{
    const {value} = error.target
    const {name} = error.target
    this.setState({[name]:value})
    this.handleSearch(error)
  }

  processShowBooks = (results) => {
    return results.map((book, key) => <ShowBook key={key} book={book}/> )
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Google Book Search</h1>
        </header>
        <Search 
          handleSearch={this.handleSearch} 
          searchEntry={this.handleSearchTerm} searchValue={this.state.value} 
          handleType={this.handleTypeSelection} 
          filterSelection={this.handlefilterSelection} 
          handleSelect = {this.handleSelectTerm}
        />
       { this.state.results ? this.processShowBooks(this.state.results) : '' }
       { this.state.error ? this.state.error : '' }
      </div>
    );
  }
}

export default App;