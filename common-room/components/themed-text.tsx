import { Text, type TextProps } from "react-native";
import { Colors } from "../constants/colors";

export function ThemedText({ style, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          color: Colors.light.text,
          lineHeight: 22,
        },
        style,
      ]}
    />
  );
}
