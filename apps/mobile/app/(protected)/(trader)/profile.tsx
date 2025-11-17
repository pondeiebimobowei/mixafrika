import { Text } from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Profile Page</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
