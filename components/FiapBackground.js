import { View, StyleSheet } from "react-native";

const dots = [
  { top: "9%", left: "7%", size: 4 },
  { top: "10%", left: "11%", size: 2 },
  { top: "14%", left: "7%", size: 5 },
  { top: "18%", left: "14%", size: 3 },
  { top: "23%", left: "11%", size: 2 },
  { top: "28%", left: "7%", size: 2 },
  { top: "58%", left: "7%", size: 3 },
  { top: "66%", left: "5%", size: 5 },
  { top: "74%", left: "5%", size: 5 },
  { top: "80%", left: "7%", size: 3 },
  { top: "78%", left: "12%", size: 5 },
  { top: "84%", left: "10%", size: 3 },
  { top: "76%", right: "11%", size: 3 },
  { top: "84%", right: "14%", size: 4 },
  { top: "90%", right: "9%", size: 5 },
  { top: "16%", right: "7%", size: 2 },
  { top: "20%", right: "10%", size: 3 },
  { top: "25%", right: "6%", size: 3 },
  { top: "35%", right: "7%", size: 3 },
];

export default function FiapBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.line, styles.leftLine]} />
      <View style={[styles.line, styles.rightLine]} />
      {dots.map((dot, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              top: dot.top,
              left: dot.left,
              right: dot.right,
              width: dot.size,
              height: dot.size,
              borderRadius: dot.size / 2,
            },
          ]}
        />
      ))}
      <View style={[styles.plus, { top: "9%", right: "4%" }]} />
      <View style={[styles.plus, { top: "81%", left: "13%" }]} />
      <View style={[styles.square, { top: "23%", left: "14%" }]} />
      <View style={[styles.square, { top: "82%", left: "15%" }]} />
      <View style={[styles.thinBar, { top: "10%", right: "13%" }]} />
      <View style={[styles.thinBar, { bottom: "20%", right: "5%" }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    backgroundColor: "#d8e5ea",
    opacity: 0.85,
    shadowColor: "#d8e5ea",
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  line: {
    position: "absolute",
    width: 1,
    height: "72%",
    top: "14%",
    backgroundColor: "#3b464b",
  },
  leftLine: { left: "45%" },
  rightLine: { right: "3%", height: "28%", top: "62%" },
  plus: {
    position: "absolute",
    width: 9,
    height: 9,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#718087",
    transform: [{ rotate: "45deg" }],
  },
  square: {
    position: "absolute",
    width: 7,
    height: 7,
    borderWidth: 1,
    borderColor: "#53636a",
  },
  thinBar: {
    position: "absolute",
    width: 42,
    height: 1,
    backgroundColor: "#718087",
  },
});
