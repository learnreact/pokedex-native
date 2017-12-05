import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import {
  Route,
  Link,
  Redirect,
  NativeRouter as Router
} from "react-router-native";

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 32
  }
});

const characterStyles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: "bold"
  }
});

class PokemonFetch extends React.Component {
  state = { character: null };

  setPokemon = id =>
    fetch(`https://d1s1rehmg7ei44.cloudfront.net/api/v2/pokemon/${id}/`)
      .then(res => res.json())
      .then(json => this.setState({ character: json }));

  componentDidMount() {
    this.setPokemon(this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setPokemon(nextProps.id);
  }

  render() {
    return this.state.character ? (
      this.props.render(this.state.character)
    ) : (
      <View>
        <Text>loading...</Text>
      </View>
    );
  }
}

const Pokemon = props => {
  return (
    <View>
      <Text style={characterStyles.name}>{props.character.name}</Text>

      <Image
        source={{
          uri: props.character.sprites.front_default,
          width: 96,
          height: 96
        }}
      />
    </View>
  );
};

class Index extends React.Component {
  state = { characters: [] };

  setPokemon = () =>
    fetch(`https://d1s1rehmg7ei44.cloudfront.net/api/v2/pokemon/`)
      .then(res => res.json())
      .then(json => this.setState({ characters: json.results }));

  componentDidMount() {
    this.setPokemon();
  }

  render() {
    return this.state.characters ? (
      <View>
        {this.state.characters.map(pokemon => (
          <View key={pokemon.name}>
            <Link to={`/pokemon/${pokemon.url.match(/\/(\d+)\/$/)[1]}`}>
              <Text>{pokemon.name}</Text>
            </Link>
          </View>
        ))}
      </View>
    ) : (
      <View>loading...</View>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <View style={appStyles.container}>
          <Route path="/" exact={true} component={Index} />

          <Route
            path="/pokemon/:id"
            exact={true}
            render={({ match }) => {
              const id = parseInt(match.params.id, 10);

              return id === 0 ? (
                <Redirect to="/" />
              ) : (
                <View>
                  <Link to="/">
                    <Text>{"<"} Back</Text>
                  </Link>

                  <PokemonFetch
                    id={match.params.id}
                    render={character => <Pokemon character={character} />}
                  />

                  <Link to={`/pokemon/${id - 1}`}>
                    <Text>Previous</Text>
                  </Link>
                  <Link to={`/pokemon/${id + 1}`}>
                    <Text>Next︎</Text>
                  </Link>
                </View>
              );
            }}
          />
        </View>
      </Router>
    );
  }
}

export default App;
