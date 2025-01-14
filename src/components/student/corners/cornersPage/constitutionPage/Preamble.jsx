// // import React from "react";
// // import { View, StyleSheet } from "react-native";

// // const Preamble = () => {
// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.rectangle}>
// //         <View style={styles.slant} />
// //       </View>
// //     </View>
// //   );
// // };

// // export default Preamble;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "#f9f9f9",
// //   },
// //   rectangle: {
// //     width: 200,
// //     height: 100,
// //     backgroundColor: "#4CAF50",
// //     position: "relative",
// //     overflow: "hidden",
// //   },
// //   slant: {
// //     position: "absolute",
// //     top: 0,
// //     right: -10, // Adjust for the diagonal cut
// //     width: 100, // Adjust for the size of the slant
// //     height: 200, // Larger than the rectangle's height for a sharp cut
// //     backgroundColor: "#f9f9f9",
// //     transform: [{ rotate: "45deg" }], // Creates the slant
// //   },
// // });

// import React from "react";
// import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

// const dummyData = [
//   {
//     name: "John Doe",
//     articles: [
//       { id: 1, title: "Article 1 by John", content: "This is the content of Article 1 by John." },
//       { id: 2, title: "Article 2 by John", content: "This is the content of Article 2 by John." },
//     ],
//   },
//   {
//     name: "Jane Smith",
//     articles: [
//       { id: 1, title: "Article 1 by Jane", content: "This is the content of Article 1 by Jane." },
//       { id: 2, title: "Article 2 by Jane", content: "This is the content of Article 2 by Jane." },
//     ],
//   },
// ];

// // Home Screen: List of Names
// const Preamble = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>List of Names</Text>
//       <FlatList
//         data={dummyData}
//         keyExtractor={(item) => item.name}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.item}
//             onPress={() => navigation.navigate("Articles", { name: item.name, articles: item.articles })}
//           >
//             <Text style={styles.itemText}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// export default Preamble;
// // Articles Screen: List of Articles for a Selected Name
// const ArticlesScreen = ({ route, navigation }) => {
//   const { name, articles } = route.params;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Articles by {name}</Text>
//       <FlatList
//         data={articles}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.item}
//             onPress={() => navigation.navigate("ArticlePage", { title: item.title, content: item.content })}
//           >
//             <Text style={styles.itemText}>{item.title}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// // Article Page Screen: Display the Content of the Article
// const ArticlePage = ({ route }) => {
//   const { title, content } = route.params;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>{title}</Text>
//       <Text style={styles.content}>{content}</Text>
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#f9f9f9",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   item: {
//     padding: 16,
//     marginVertical: 8,
//     backgroundColor: "#e0e0e0",
//     borderRadius: 8,
//   },
//   itemText: {
//     fontSize: 18,
//   },
//   content: {
//     fontSize: 16,
//     marginTop: 16,
//   },
// });

// import React, { useState,useEffect } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import Constitution from '../Constitution';
// import BareAct from './BareAct';
// import Blogs from '../Blogs';
// import Articles from '../../../home/Articles';

// const { width } = Dimensions.get('window');

// // Tab Configurations for Each Card
// const tabConfig = {
//   1: {
//     tabs: ['Constitution', 'BareAct', 'Articles'],
//     components: {
//       Constitution: Constitution,
//       BareAct: BareAct,
//       Articles: Articles,
//     },
//   },
//   2: {
//     tabs: ['Blogs'],
//     components: {
//       Blogs: Blogs,
//     },
//   },
// };

// const TabMenu = ({ selectedCard }) => {
//     const [activeTab, setActiveTab] = useState(tabConfig[selectedCard]?.tabs[0]); // Default to the first tab of the selected card

//     const tabs = tabConfig[selectedCard]?.tabs || [];
//     const components = tabConfig[selectedCard]?.components || {};
//     useEffect(() => {
//         setActiveTab(tabs[0]); // Reset to first tab of the newly selected card
//       }, [selectedCard, tabs]);
  
//     console.log('selectedCard:', selectedCard);
//     console.log('tabs:', tabs);
//     console.log('components:', components);

//   const ActiveComponent = components[activeTab];

//   if (!ActiveComponent) {
//     return <Text>Error: Component not found for {activeTab}</Text>;
//   }

//   return (
//     <View style={styles.tabMenu}>
//       <View style={styles.tabNames}>
//         {tabs.map(tabName => (
//           <TouchableOpacity
//             key={tabName}
//             style={[
//               styles.tabButton,
//               activeTab === tabName && styles.activeTabButton,
//             ]}
//             onPress={() => setActiveTab(tabName)}
//           >
//             <Text
//               style={
//                 activeTab === tabName ? styles.activeTabText : styles.tabText
//               }
//             >
//               {tabName}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//       <View style={styles.tabContent}>
//         <ActiveComponent />
//       </View>
//     </View>
//   );
// };

// const Preamble = () => {
//   const [selectedCard, setSelectedCard] = useState(1); // Default to the first card
//   const data = [
//     { id: 1, title: 'Card 1' },
//     { id: 2, title: 'Card 2' },
//     { id: 3, title: 'Card 3' },
//   ];

//   // Reset the activeTab whenever the selectedCard changes to show the first tab for that card
//   const handleCardSelect = (id) => {
//     setSelectedCard(id);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Render Cards */}
//       {data.map(card => (
//         <View key={card.id} style={{ margin: 10 }}>
//           <TouchableOpacity
//             onPress={() => handleCardSelect(card.id)} // Set the selected card on press
//             style={{
//               padding: 20,
//               backgroundColor: '#ddd',
//               borderRadius: 10,
//             }}
//           >
//             <Text>{card.title}</Text>
//           </TouchableOpacity>
//         </View>
//       ))}

//       {/* Tab Menu for the selected card */}
//       <TabMenu selectedCard={selectedCard} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   tabMenu: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: '#d9f9b1',
//     borderRadius: 8,
//   },
//   tabNames: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//   },
//   tabButton: {
//     padding: 10,
//   },
//   activeTabButton: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#4caf50',
//   },
//   tabText: {
//     fontSize: 16,
//     color: '#555',
//   },
//   activeTabText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#4caf50',
//   },
//   tabContent: {
//     marginTop: 10,
//   },
// });

// export default Preamble;


import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Preamble = () => {
  const [activeCard, setActiveCard] = useState(1); // Default to the first card

  const cards = [
    { id: 1, name: 'Card 1', content: 'Content for Card 1' },
    { id: 2, name: 'Card 2', content: 'Content for Card 2' },
    { id: 3, name: 'Card 3', content: 'Content for Card 3' },
    { id: 4, name: 'Card 4', content: 'Content for Card 4' },
  ];

  return (
    <View style={styles.container}>
      {/* Render card buttons */}
      <View style={styles.cardButtons}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.cardButton,
              activeCard === card.id && styles.activeCardButton,
            ]}
            onPress={() => setActiveCard(card.id)} // Set the active card on press
          >
            <Text style={styles.cardButtonText}>{card.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Render the content of the active card */}
      <View style={styles.cardContent}>
        {cards.map(
          (card) =>
            activeCard === card.id && (
              <Text key={card.id} style={styles.cardText}>
                {card.content}
              </Text>
            )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cardButton: {
    padding: 15,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  activeCardButton: {
    backgroundColor: '#1261D1',
  },
  cardButtonText: {
    fontSize: 16,
    color: '#000',
  },
  cardContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardText: {
    fontSize: 18,
  },
});

export default Preamble;
