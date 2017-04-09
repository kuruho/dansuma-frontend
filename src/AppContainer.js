/* global fetch */
import React from "react";
import { Linking, Platform } from "react-native";

import App from "./App";

import { SocketProvider, socketConnect } from "socket.io-react";
import io from "socket.io-client";

const wsurl = process.env.WEBSOCKET_URL
  ? process.env.WEBSOCKET_URL
  : "http://localhost:4000";

export default class AppContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      votedSong: null,
      votedColor: null,

      filter: "Top", // 'Latest''
      page: 0,
      errors: {},
      items: [],
      currentSong: {
        title: "...loading",
        author: "",
        color: "#",
        id: 123
      },
      songs: [
        {
          title: "Il cielo in una stanza Il cielo in una stanza",
          author: "Albano",
          color: "yellow",
          id: 1
        },
        {
          title: "Il cielo in una stanza",
          author: "Albano",
          color: "green",
          id: 2
        },
        {
          title: "Il cielo in una stanza",
          author: "Albano",
          color: "violet",
          id: 3
        },
        {
          title: "Il cielo in una stanza",
          author: "Albano",
          color: "blue",
          id: 4
        },
        {
          title: "Ero io forse",
          author: "Mina",
          color: "orange",
          id: 5
        }
      ]
      // items: [
      //   {
      //     created_at: "2016-08-08T13:09:09.000Z",
      //     title: "Moving 12 years of email from GMail to FastMail",
      //     url: "https://cpbotha.net/2016/08/06/moving-12-years-of-email-from-gmail-to-fastmail/",
      //     author: "cpbotha",
      //     points: 602,
      //     story_text: null,
      //     comment_text: null,
      //     num_comments: 346,
      //     story_id: null,
      //     story_title: null,
      //     story_url: null,
      //     parent_id: null,
      //     created_at_i: 1470661749
      //   },
      // ]
    };

    this.socket = io.connect(wsurl, { transports: ["websocket"] });

    setTimeout(
      () => {
        // console.log(this.socket)
        // this.socket.emit('user:login')
        console.log("ready");
        this.socket.emit("app:ready");
      },
      500
    );

    this.socket.on("app:state", data => {
      console.log("appstate", data.data);
      const appState = data.data;

      this.setState({ currentSong: appState.song });
    });

    this.socket.on("app:songlist", data => {
      console.log("appsonglist", data.data);
      const songs = data.data;
      this.setState({ songs: songs });
    });

    this.loadMore = this.loadMore.bind(this);
    this.loadItems = this.loadItems.bind(this);
    this.openUrl = this.openUrl.bind(this);
    this.toggleOverlay = this.toggleOverlay.bind(this);
    this.voteSong = this.voteSong.bind(this);
  }

  componentDidMount() {
    // default items load
    // this.loadItems(this.state.filter);
  }

  voteSong(songId) {
    // votedColor: this.state.songs[songId].color
    const items = this.state.songs;
    const selSong = items.find(el => el.id === songId);
    this.setState({ votedSong: songId, votedColor: selSong.color });
    console.log(`voted ${songId}`);
    // console.log(this.state)
  }

  openUrl(url) {
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    }
    if (Platform.OS === "android" || Platform.OS === "ios") {
      Linking.openURL(url).catch(err =>
        console.error("An error occurred", err));
    }
  }

  loadItems(filter) {
    this.setState({ filter: filter });
    // HACK: to avoid React state change race condition
    setTimeout(
      () => {
        this.loadMore("reset");
      },
      0
    );
  }

  loadMore(mode) {
    const page = mode === "reset" ? 0 : this.state.page;
    this.setState({ loading: true });
    const urls = {
      Top: `https://hn.algolia.com/api/v1/search_by_date?tags=front_page&page=${page}`,
      Latest: `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`
    };
    const fetchUrl = urls[this.state.filter];
    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        const previousItems = page === 0 ? [] : this.state.items;
        this.setState({
          items: [...previousItems, ...data.hits],
          loading: false,
          errors: {},
          page: page + 1
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          errors: {
            error
          }
        });
        console.error(error, page);
      });
  }

  toggleOverlay() {
    const { overlayVisible } = this.state;
    this.setState({ overlayVisible: !overlayVisible });
  }

  render() {
    return (
      <SocketProvider socket={this.socket}>
        {/*<Event event="response" handler={this.handleEventResponse} />*/}
        <App
          items={this.state.items}
          errors={this.state.errors}
          loading={this.state.loading}
          filter={this.state.filter}
          overlayVisible={this.state.overlayVisible}
          onOpenUrl={this.openUrl}
          onLoadItems={this.loadItems}
          onLoadMore={this.loadMore}
          onToggleOverlay={this.toggleOverlay}
          voteSong={this.voteSong}
          votedSong={this.state.votedSong}
          votedColor={this.state.votedColor}
          songs={this.state.songs}
          currentSong={this.state.currentSong}
        />
      </SocketProvider>
    );
  }
}
