import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Pressable,
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";

type Position = "bottom" | "top" | "left" | "right";
type Size = "sm" | "md" | "lg" | "full" | number | string;

export interface SheetProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: Position;
  size?: Size; // accepts preset sizes or raw value (e.g. 300, '80%')
  backdropClosable?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const sizeToStyle = (size: Size, position: Position) => {
  if (typeof size === "number") {
    return position === "left" || position === "right"
      ? { width: size }
      : { height: size };
  }

  if (typeof size === "string") {
    return position === "left" || position === "right"
      ? { width: size }
      : { height: size };
  }

  switch (size) {
    case "sm":
      return position === "left" || position === "right"
        ? { width: SCREEN_WIDTH * 0.35 }
        : { height: SCREEN_HEIGHT * 0.25 };
    case "md":
      return position === "left" || position === "right"
        ? { width: SCREEN_WIDTH * 0.55 }
        : { height: SCREEN_HEIGHT * 0.5 };
    case "lg":
      return position === "left" || position === "right"
        ? { width: SCREEN_WIDTH * 0.8 }
        : { height: SCREEN_HEIGHT * 0.8 };
    case "full":
      return position === "left" || position === "right"
        ? { width: SCREEN_WIDTH }
        : { height: SCREEN_HEIGHT };
    default:
      return position === "left" || position === "right"
        ? { width: SCREEN_WIDTH * 0.55 }
        : { height: SCREEN_HEIGHT * 0.5 };
  }
};

export default function Sheet({
  open,
  onOpenChange,
  position = "bottom",
  size = "md",
  backdropClosable = true,
  header,
  footer,
  children,
}: SheetProps) {
  const anim = useRef(new Animated.Value(0)).current; // 0 closed, 1 open

  const translate = useRef(new Animated.Value(0)).current;

  const isVertical = position === "top" || position === "bottom";
  const sheetStyle = sizeToStyle(size, position);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (isVertical) {
          translate.setValue(gestureState.dy);
        } else {
          translate.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_e, gestureState) => {
        const velocity = isVertical ? gestureState.vy : gestureState.vx;
        const travel = isVertical ? gestureState.dy : gestureState.dx;

        const shouldClose = Math.abs(travel) > 80 || Math.abs(velocity) > 0.8;
        if (shouldClose) {
          close();
        } else {
          openAnimate();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (open) {
      openAnimate();
    } else {
      closeAnimate();
    }
  }, [open]);

  const openAnimate = () => {
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeAnimate = (cb?: () => void) => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => cb && cb());
  };

  const close = () => {
    // animate out then call onOpenChange(false)
    closeAnimate(() => {
      onOpenChange && onOpenChange(false);
    });
  };

  // Interpolate backdrop opacity
  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  // Compute sheet transform depending on position
  const sheetTranslate = (() => {
    if (isVertical) {
      const finalOffset = position === "bottom" ? SCREEN_HEIGHT : -SCREEN_HEIGHT;
      const base = anim.interpolate({ inputRange: [0, 1], outputRange: [finalOffset, 0] });
      return Animated.add(base, translate);
    } else {
      const finalOffset = position === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
      const base = anim.interpolate({ inputRange: [0, 1], outputRange: [finalOffset, 0] });
      return Animated.add(base, translate);
    }
  })();

  const sheetTransformStyle = isVertical
    ? { transform: [{ translateY: sheetTranslate }] }
    : { transform: [{ translateX: sheetTranslate }] };

  return (
    <Modal className="bg-white" transparent visible={open} animationType="none" statusBarTranslucent>
      <View className="flex-1 flex-end">
        <Animated.View
          className="bg-black absolute left-0 right-0 top-0 bottom-0"

          style={[ { opacity: backdropOpacity }]}
          pointerEvents={open ? "auto" : "none"}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => backdropClosable && close()}
          />
        </Animated.View>

        <Animated.View
          {...panResponder.panHandlers}
          className={` 
            ${
              position === "bottom" ? 'left-0 right-0 bottom-0': 
              position === "top" ? 'left-0 right-0 top-0' : 
              position === "left" ? 'top-0 bottom-0 left-0' : 
              position === "right" ? 'top-0 bottom-0 right-0' : ''
            } 
            absolute bg-gray-200 dark:bg-black rounded-tl-[12px] rounded-tr-[12px] overflow-hidden shadow-black shadow-offset-0--4  shadow-opacity-20  shadow-radius-[10px] elevation-[10]`}
          style={[
            // sheetStyle,
            sheetTransformStyle,
          ]}
        >
          {/* Drag handle */}
          <View className="items-center py-2">
            <View className="w-10 h-1 rounded bg-[#e2e8f0]" />
          </View>

          {header ? <View className="px-4 pb-2">{header}</View> : null}

          <View className="px-3 pb-6">{children}</View>

          {footer ? <View className="p-4 border-t border-[#eee]">{footer}</View> : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

