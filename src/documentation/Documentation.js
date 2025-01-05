import React, {useState, useEffect, useCallback} from 'react';
import {
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    View,
    Alert,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native';
import Markdown from 'react-native-markdown-display';

const Documentation = ({navigation, route}) => {
    const [markdownContent, setMarkdownContent] = useState('');
    const fileUrl = route.params.fileUrl;
    const [loading, setLoading] = useState(false);

    const loadMarkdown = useCallback(async url => {
        setLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch documentation: ${response.status}`);
            }
            const content = await response.text();
            const processedContent = processMarkdown(content);
            setMarkdownContent(processedContent);
        } catch (error) {
            console.error('Error loading Markdown:', error);
            Alert.alert(
                'Ошибка',
                'Не удалось загрузить документацию. Пожалуйста, попробуйте позже.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const customRenderers = {
        image: props => {
            const {src} = props;
            return (
                <Image
                    source={{uri: src}}
                    style={{width: 200, height: 200, marginBottom: 10}}
                />
            );
        },
    };

    const renderTable = (markdown) => {
        const tableRegex = /\|(.+?)\|/g;
        const rows = markdown.match(tableRegex);
        if (!rows) return markdown;

        const table = rows.map(row => {
            const cells = row.split('|').filter(cell => cell.trim() !== '');
            return (
                <View style={styles.tableRow} key={row}>
                    {cells.map((cell, index) => (
                        <Text style={styles.tableCell} key={index}>
                            {cell.trim()}
                        </Text>
                    ))}
                </View>
            );
        });

        return <View style={styles.table}>{table}</View>;
    };


    const processMarkdown = (markdown) => {
        markdown = markdown.replace(/!\[([^\]]*)]\(([^)]+)\)/g, (match, alt, src) => {
            if (!src.startsWith('http')) {
                src = `https://raw.githubusercontent.com/SnezhG/pet-diary-documentation/main/docs/features/${src}`;
            }
            return `![${alt}](${src})`;
        });

        if (markdown.includes('|')) {
            const table = renderTable(markdown);
            setMarkdownContent(table);
        }

        return markdown;
    };


    useEffect(() => {
        if (fileUrl) {
            loadMarkdown(fileUrl);
        }
    }, [fileUrl, loadMarkdown]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="green" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <ScrollView horizontal={true} style={{flex: 1}}>
                    <Markdown renderers={customRenderers} style={markdownStyles}>
                        {markdownContent}
                    </Markdown>
                </ScrollView>
                <TouchableOpacity
                    style={styles.transparentButton}
                    onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>Вернуться в дом</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );

};

const styles = StyleSheet.create({
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingBottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transparentButton: {
        backgroundColor: 'transparent',
        color: '#666',
        marginBottom: 15,
        width: 300,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#666',
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
    },
});

const markdownStyles = {
    body: {
        flexWrap: 'wrap',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
    },
    th: {
        backgroundColor: '#f8f8f8',
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        padding: 8,
    },
    td: {
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        padding: 8,
    },
};



export default Documentation;
