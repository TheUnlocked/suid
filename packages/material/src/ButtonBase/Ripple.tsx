import Box from "../Box";
import { RipplePropsTypeMap } from "./RippleProps";
import createComponentFactory from "@suid/base/createComponentFactory";
import clsx from "clsx";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

const $ = createComponentFactory<RipplePropsTypeMap>()({
  name: "MuiRipple",
  selfPropNames: [
    "class",
    "classes",
    "pulsate",
    "rippleX",
    "rippleY",
    "rippleSize",
    "in",
    "onExited",
    "timeout",
  ],
  propDefaults: ({ set }) =>
    set({
      pulsate: false,
      classes: {},
    }),
});

/**
 * @ignore - internal component.
 */
const Ripple = $.component(function Ripple({ props, otherProps }) {
  const [leaving, setLeaving] = createSignal(false);

  const rippleClassName = () =>
    clsx(
      props.class,
      props.classes.ripple,
      props.classes.rippleVisible,
      props.classes.ripplePulsate && {
        [props.classes.ripplePulsate]: props.pulsate,
      }
    );
  const rippleStyles = () => ({
    width: `${props.rippleSize}px`,
    height: `${props.rippleSize}px`,
    top: `${-(props.rippleSize / 2) + props.rippleY}px`,
    left: `${-(props.rippleSize / 2) + props.rippleX}px`,
  });

  const childClassName = () =>
    clsx(
      props.classes.child,
      props.classes.childLeaving && {
        [props.classes.childLeaving]: leaving(),
      },
      props.classes.childPulsate && {
        [props.classes.childPulsate]: props.pulsate,
      }
    );

  createEffect(() => {
    if (!props.in && !leaving()) {
      setLeaving(true);
    }
  });

  let timeoutId: number | undefined;

  createEffect(() => {
    if (!props.in && props.onExited) {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(props.onExited, props.timeout);
    }
  });

  onCleanup(() => clearTimeout(timeoutId));

  return (
    <Box
      as="span"
      class={rippleClassName()}
      style={rippleStyles()}
      sx={otherProps.sx}
    >
      <span class={childClassName()} />
    </Box>
  );
});

export default Ripple;
