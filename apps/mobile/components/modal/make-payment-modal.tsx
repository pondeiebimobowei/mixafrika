import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface MakePaymentModalProps {
  show: boolean;
  onClose: () => void;
}

export default function MakePaymentModal({
  show,
  onClose,
}: MakePaymentModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={onClose}
    >
      <View className="bg-black/50 flex-1 justify-end items-center">
        <View className="w-full p-10 bg-slate-900">
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-2xl">Make Payment</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-2xl font-bold text-white">X</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="w-full">
            <View className="my-10">
              <Text className="text-white text-xl my-2">Amount</Text>
              <TextInput
                className="bg-black text-white w-full h-16 px-4 text-2xl"
                keyboardType="number-pad"
                placeholder="5500"
                value="5500"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
