import { FlatList, TouchableOpacity } from "react-native";

import { CardItem } from "../../types/CardItem";
import { Product } from "../../types/Product";

import { Text } from "../Text";

import {
  Actions,
  Item,
  ProductContainer,
  Image,
  QuantityContainer,
  ProductDetails,
  Summary,
  TotalContaner,
} from "./style";

import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../Button";

import { PlusCircle } from "../Icons/PlusCircle";
import { MinusCircle } from "../Icons/MinusCircle";

import { OrderConfirmedModal } from "../OrderConfirmedModal";
import { useState } from "react";

interface CartProps {
  cartItems: CardItem[];
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onConfirmOrder: () => void;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder }: CartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const total = cartItems.reduce((acc, cardItem) => {
    return acc + cardItem.quantity * cardItem.product.price;
  }, 0);

  function handleConfirmOrder() {
    setIsModalVisible(true);
  }

  function handleOk() {
    onConfirmOrder();
    setIsModalVisible(false);
  }

  return (
    <>
      <OrderConfirmedModal 
        visible={isModalVisible} 
        onOk={handleOk} 
      />

      {
        cartItems.length > 0 && (
          <FlatList 
            data={cartItems}
            keyExtractor={cardItem => cardItem.product._id}
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: 20, maxHeight: 150 }}
            renderItem={({ item: cardItem }) => (
              <Item>
                <ProductContainer>
                  <Image
                    source={{
                      uri: `http://192.168.1.4:3001/uploads/${cardItem.product.imagePath}`
                    }}
                  />

                  <QuantityContainer>
                    <Text size={14} color="#666">
                      {cardItem.quantity}x
                    </Text>
                  </QuantityContainer>

                  <ProductDetails>
                    <Text size={14} weight="600">{cardItem.product.name}</Text>
                    <Text size={14} color="#666" style={{ marginTop: 4 }}>
                      {formatCurrency(cardItem.product.price)}
                    </Text>
                  </ProductDetails>
                </ProductContainer>
                <Actions>
                  <TouchableOpacity 
                    style={{ marginRight: 24 }}
                    onPress={() => onAdd(cardItem.product)}
                  >
                    <PlusCircle />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onDecrement(cardItem.product)}>
                    <MinusCircle />
                  </TouchableOpacity>
                </Actions>
              </Item>
            )}
          />
        )
      }

      <Summary>
        <TotalContaner>
          {
            cartItems.length > 0 ? (
              <>
                <Text color="#666">Total</Text>
                <Text size={20} weight="600">{formatCurrency(total)}</Text>
              </>
            ) : (
              <Text color="#999">Seu carrinho está vazio</Text>
            )
          }
        </TotalContaner> 

        <Button 
          onPress={handleConfirmOrder}
          disabled={cartItems.length === 0}
          loading={isLoading}
        >
          Confirmar pedido        
        </Button>           
      </Summary>
    </>
  );
}