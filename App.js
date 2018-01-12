/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator
} from 'react-native';
import Placeholder from 'rn-placeholder';

const words = [
  {
    width: '30%',
  },
  {
    width: '70%',
  },
];

export default class App extends PureComponent<{}> {


  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        // console.log('====================================');
        // console.log('makeRemoteRequest res: ', res);
        // console.log('====================================');
        
        // unshow place holder
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });

        // show place holder
        // this.setState({
        //   data: page === 1 ? res.results : [...this.state.data, ...res.results],
        //   error: res.error || null,
        //   // loading: false,
        //   // refreshing: false
        // }, (() => {
        //   this.setState({
        //     loading: false,
        //     refreshing: false
        //   })
        // }));

      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };


  render() {
    const { data, loading } = this.state;
    // console.log('====================================');
    // console.log('render loading: ', loading);
    // console.log('====================================');
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={this.renderRow}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          // ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
        // numColumns={2}
        // onEndReachedThreshold={50}
        // extraData={loading}
        />
      </View>
    );
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderRow = ({ item }) => {
    const { loading } = this.state;
    // console.log('====================================');
    // console.log('renderRow !loading: ', !loading);
    // console.log('====================================');

    //unshow placeholder
    return (
      <View style={styles.rowWrapper}>
        <View style={styles.avatarWrapper}>
          <Image
            style={styles.avatar}
            source={{ uri: item.picture.large ? item.picture.large : 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
          />
        </View>
        <View style={styles.contentWrapper}>
          <View style={styles.titleWrapper}>
            <View style={styles.firstName}>
              <Text style={styles.contentText}>{item.name.first + " "}</Text>
            </View>
            <View style={styles.lastName}>
              <Text style={styles.contentText}>{item.name.last}</Text>
            </View>
          </View>
          <View style={styles.subTitleWrapper}>
            <Text style={styles.contentText}>{item.email}</Text>
          </View>
        </View>
      </View>
    )


    //show placeholder
    // return (
    //   <View style={styles.rowWrapper}>
    //     <Placeholder.MultiWords onReady={!loading} words={words} animate="fade">
    //       <View style={styles.rowWrapper}>
    //         <View style={styles.avatarWrapper}>
    //           <Image
    //             style={styles.avatar}
    //             source={{ uri: item.picture.large ? item.picture.large : 'https://facebook.github.io/react-native/docs/assets/favicon.png' }}
    //           />
    //         </View>
    //         <View style={styles.contentWrapper}>
    //           <View style={styles.titleWrapper}>
    //             <View style={styles.firstName}>
    //               <Text style={styles.contentText}>{item.name.first + " "}</Text>
    //             </View>
    //             <View style={styles.lastName}>
    //               <Text style={styles.contentText}>{item.name.last}</Text>
    //             </View>
    //           </View>
    //           <View style={styles.subTitleWrapper}>
    //             <Text style={styles.contentText}>{item.email}</Text>
    //           </View>
    //         </View>
    //       </View>
    //     </Placeholder.MultiWords>
    //   </View>

    // )

  }

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };


}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rowWrapper: {
    // backgroundColor: 'green',
    flex: 1,
    flexDirection: 'row',
    height: 100,
  },
  avatarWrapper: {
    // backgroundColor: 'yellow',
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',

  },
  contentWrapper: {
    // backgroundColor: 'blue',
    flex: 0.7,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  titleWrapper: {
    flexDirection: 'row',
    paddingBottom: 10
  },
  subTitleWrapper: {

  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    // borderWidth: 0.5,
  },
  contentText: {
    color: '#000000',
    fontSize: 14
  }
});