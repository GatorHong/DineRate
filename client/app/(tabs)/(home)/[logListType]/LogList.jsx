import {View, FlatList, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {useLocalSearchParams, useNavigation} from 'expo-router';
import {useLayoutEffect, useState} from 'react';
import LogCard from '../../../../components/LogCard';
import {useThemeStyles} from '../../../../constants/Styles';

export default function LogList() {
    const {logListType} = useLocalSearchParams();
    const {styles: themeStyles, colors} = useThemeStyles();
    const [loading] = useState(false);

    //set the header title based on logListType
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            title: logListType
        });
    }, [navigation, logListType]);


    // Dummy data for demonstration
    const logs = [
        {id: '1', title: 'Log 1', description: 'Description 1', category: logListType, rating: 4.5, tag: 'tag1'},
        {id: '2', title: 'Log 2', description: 'Description 2', category: logListType, rating: 3.8, tag: 'tag2'},
        {id: '3', title: 'Log 3', description: 'Description 3', category: logListType, rating: 2.6, tag: 'tag2'},
    ];

    const renderItem = ({item}) => (
        <LogCard log={item}/>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={colors.tint}/>
            ) : (
                <FlatList
                    data={logs}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        padding: 16,
    },
});
