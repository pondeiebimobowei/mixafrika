import { Text } from 'react-native';

export default function ErrorMessageDisplay({
  message,
}: {
  message: string | undefined;
}) {
  return <Text className="text-destructive mt-1">{message}</Text>;
}
