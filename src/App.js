import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
  
import './App.css';

const { Component } = React;
const { render } = ReactDOM;
var searchquery;

const LOAD_STATE = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  LOADING: 'LOADING'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      red:true,
      fav:{},
      star:{},
      photos: [],
      totalPhotos: 0,
      perPage: 5,
      currentPage: 1,
      count:0,
      updated:false,
      loadState: LOAD_STATE.LOADING
    }
  }
  starImage=(id, e)=>
  {
    if(this.state.fav[id]==undefined)
      {
        this.state.fav[id]=false;
      }
    this.setState({
        fav : { ...this.state.fav,[id]: !this.state.fav[id]}
        
      });
    console.log(id,this.state.fav[id]);
  }
  checkStar=(id)=>
  {
    return this.state.fav[id];
  }
  favImage=(id, e)=>
  {
    if(this.state.star[id]==undefined)
      {
        this.state.star[id]=0;
      }
    this.setState({
        star : { ...this.state.star,[id]: this.state.star[id] +1}
        
      });
    console.log(id,this.state.star[id]);
  }
  checkFav=(id)=>
  {
    return this.state.star[id];
  }
  
  componentDidMount() {
    this.fetchPhotos(this.state.currentPage);
  }
  
  fetchPhotos(page) {
    var self = this;
    const { perPage } = this.state;
    const { appId } = this.props;
    var baseUrl;
    const options = {
      params: {
        client_id: appId,
        page: page,
        per_page: perPage,
        query:searchquery
      }
    };
    
    this.setState({ loadState: LOAD_STATE.LOADING });
    if(this.state.updated==false){
    baseUrl='https://api.unsplash.com/photos/curated'
    axios.get(baseUrl, options)
      .then((response) => {
        self.setState({
          photos: response.data,
          totalPhotos: parseInt(response.headers['x-total']),
          currentPage: page,
          loadState: LOAD_STATE.SUCCESS
        });
      })
      .catch(() => {
        this.setState({ loadState: LOAD_STATE.ERROR });
      });
    }
    else{
    baseUrl='https://api.unsplash.com/search/photos'
    axios.get(baseUrl, options)
      .then((response) => {
        self.setState({
          photos: response.data.results,
          totalPhotos: parseInt(response.headers['x-total']),
          currentPage: page,
          loadState: LOAD_STATE.SUCCESS
        });
      })
      .catch(() => {
        this.setState({ loadState: LOAD_STATE.ERROR });
      });}
  }
  
  submitSearch = (event) => {
         event.preventDefault();
         searchquery=document.getElementById("box").value;
         if(searchquery)
           this.state.updated=true;
          else
            {
            this.state.updated=false;
            }
         console.log('Button was clicked!')
         this.fetchPhotos(1);
  }
   // changeColor= (event) => {
   //     this.setState({red: !this.state.red})
   
  render() {
    // let btn_class = this.props.checkStar(this.props.photo.id) ? "redButton" : "greenButton";

    const {baseUrl} = this.state
    return (
      <div className="app">
        <div className="search">
      <form className="search1"> 
        <input type="text" placeholder=" search.." id="box"></input>
        <a href="#"><button  className="button1" placeholder="search" onClick={this.submitSearch}>&#128269;</button></a></form>
        </div>
        <Pagination
          current={this.state.currentPage}
          total={this.state.totalPhotos} 
          perPage={this.state.perPage} 
          onPageChanged={this.fetchPhotos.bind(this)}
        />
        {this.state.loadState === LOAD_STATE.LOADING
            ? <div className="loader"></div>
            : <List data={this.state.photos}  starImage={this.starImage} checkStar={this.checkStar} favImage={this.favImage} checkFav={this.checkFav}/>  
          }
        
      </div>
    )
  }
}

// const ListItem = ({ photo }) => {
  
//   return (
//     <div key={photo.id} className="grid__item card">
//       <div className="card__body">
//         <img src={photo.urls.small} alt="" />
//       </div>
//       <div className="card__footer media">
//         <img src={photo.user.profile_image.small} alt="" className="media__obj" />
//         <div className="media__body">
          
//           <a href={photo.user.portfolio_url} target="_blank">{ photo.user.name }</a>
//           <button className={btn_class} onClick={this.changeColor.bind(this)}>
//                   Button
//              </button>
//         </div>
//       </div>
//     </div>
//   )
// }

class ListItem extends React.Component
{
   constructor(props){
        super(props);

     //    this.state = {
     //       red: true
     //    }
     // this.changeColor = this.changeColor.bind(this)
    }

    // changeColor(){
    //    this.setState({red: !this.state.red})
    // }

    render(){
        let btn_class = this.props.checkStar(this.props.photo.id) ? "redButton" : "greenButton";
// let like = this.props.checkFav(this.props.photo.id);

  return (
    <div key={this.props.photo.id} className="grid__item card">
      <div className="card__body">
        <img src={this.props.photo.urls.small} alt="" />
      </div>
      <div className="card__footer media">
        <img src={this.props.photo.user.profile_image.small} alt="" className="media__obj" />
        <div className="media__body">
          
          <a href={this.props.photo.user.portfolio_url} target="_blank">{ this.props.photo.user.name }</a>
         <div className="data1">
           <i className="fa fa-thumbs-up like" aria-hidden="true"  onClick={ (e) =>{this.props.favImage(this.props.photo.id,e)} }>
          </i>
        <text className="l" >{this.props.checkFav(this.props.photo.id)}</text>
          <button className={btn_class} id="favbutton" onClick={(e)=>{this.props.starImage(this.props.photo.id,e)}}>
                  &#9734;
             </button>
          </div> 
        </div>
      </div>
    </div>
  )
      console.log(this.props.checkFav(this.props.photo.id));
}
}
const List = ({ data , starImage , checkStar, favImage, checkFav}) => {
  var items = data.map(photo => <ListItem key={photo.id} photo={photo} starImage={starImage} checkStar={checkStar} favImage={favImage} checkFav={checkFav}/>);
  return (
    <div className="grid">
      { items }
    </div>
  )
}

class Pagination extends Component {  
  pages() {
    var pages = [];
    for(var i = this.rangeStart(); i <= this.rangeEnd(); i++) {
      pages.push(i)
    };
    return pages;
  }

  rangeStart() {
    var start = this.props.current - this.props.pageRange;
    return (start > 0) ? start : 1
  }

  rangeEnd() {
    var end = this.props.current + this.props.pageRange;
    var totalPages = this.totalPages();
    return (end < totalPages) ? end : totalPages;
  }

  totalPages() {
    return Math.ceil(this.props.total / this.props.perPage);
  }

  nextPage() {
    return this.props.current + 1;
  }

  prevPage() {
    return this.props.current - 1;
  }
  
  hasFirst() {
    return this.rangeStart() !== 1
  }

  hasLast() {
    return this.rangeEnd() < this.totalPages();
  }

  hasPrev() {
    return this.props.current > 1;
  }

  hasNext() {
    return this.props.current < this.totalPages();
  }

  changePage(page) {
    this.props.onPageChanged(page);
  }

  render() {
    return (
      <div className="pagination">
        <div className="pagination__left">
          <a href="#" className={!this.hasPrev() ? 'hidden': ''}
            onClick={e => this.changePage(this.prevPage())}
          >Prev</a>
        </div>

        <div className="pagination__mid">
          <ul>
            <li className={!this.hasFirst() ? 'hidden' : ''}>
              <a href="#" onClick={e => this.changePage(1)}>1</a>
            </li>
            <li className={!this.hasFirst() ? 'hidden' : ''}>...</li>
            {
              this.pages().map((page, index) => {
                return (
                  <li key={index}>
                    <a href="#"
                      onClick={e => this.changePage(page)}
                      className={ this.props.current == page ? 'current' : '' }
                    >{ page }</a>
                  </li>
                );
              })
            }
            <li className={!this.hasLast() ? 'hidden' : ''}>...</li>
            <li className={!this.hasLast() ? 'hidden' : ''}>
              <a href="#" onClick={e => this.changePage(this.totalPages())}>{ this.totalPages() }</a>
            </li>
          </ul>
        </div>

        <div className="pagination__right">
          <a href="#" className={!this.hasNext() ? 'hidden' : ''}
            onClick={e => this.changePage(this.nextPage())}
          >Next</a>
        </div>
      </div>
    );    
  }
};

Pagination.defaultProps = {
  pageRange: 2
}

render(
  <App
    appId={"8cb0835345f7baa65a5468336340cc2f011a4959f281a5aeec631172252fd784"}
    baseUrl={'https://api.unsplash.com/photos/curated'}

  />,
  document.getElementById('mount-point') 
);
export default App;
