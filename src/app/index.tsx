import { useCartStore } from "@/stores/cart-store";
import { useRef, useState } from "react";
import { FlatList, SectionList, Text, View } from "react-native";

import { CategoryButton } from "@/components/category-button";
import { Header } from "@/components/header";

import { Product } from "@/components/product";
import { CATEGORIES, MENU } from "@/utils/data/products";
import { Link } from "expo-router";

export default function Home() {
  const cartStore = useCartStore();
  const sectionListRef = useRef<SectionList>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    CATEGORIES[0]
  );

  const cartQuantityItems = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  function handleCategorySelect(selected: string) {
    setSelectedCategory(selected);

    const sectionIndex = CATEGORIES.findIndex(
      (category) => category === selected
    );

    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      });
    }
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Faça seu pedido" carQuantityItems={cartQuantityItems} />

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === selectedCategory}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        className="max-h-10 mt-5"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      <SectionList
        ref={sectionListRef}
        sections={MENU}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-white font-heading mt-8 mb-3">
            {title}
          </Text>
        )}
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
