import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { marked } from 'marked';

const SidebarNavigation = ({ onSelect }) => {
    const [sidebarContent, setSidebarContent] = useState('');
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    const SIDEBAR_URL = 'https://yourusername.github.io/your-docs-repo/_sidebar.md';

    useEffect(() => {
        const fetchSidebar = async () => {
            try {
                const response = await axios.get(SIDEBAR_URL);
                setSidebarContent(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке _sidebar.md:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSidebar();
    }, []);

    useEffect(() => {
        if (sidebarContent) {
            // Парсинг содержимого _sidebar.md
            const parsedLinks = [];
            const renderer = new marked.Renderer();

            renderer.link = (href, _, text) => {
                parsedLinks.push({ text, href });
            };

            marked(sidebarContent, { renderer });
            setLinks(parsedLinks);
        }
    }, [sidebarContent]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView style={styles.sidebar}>
            {links.map((link, index) => (
                <TouchableOpacity key={index} onPress={() => onSelect(link.href)}>
                    <Text style={styles.link}>{link.text}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    link: {
        fontSize: 16,
        color: '#1e90ff',
        marginVertical: 8,
    },
});

export default SidebarNavigation;
