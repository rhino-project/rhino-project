import * as React from 'react';
import { createLink, LinkComponent } from '@tanstack/react-router';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { useFocusRing } from '@react-aria/focus';
import { useHover } from '@react-aria/interactions';
import { useLink, type AriaLinkOptions } from '@react-aria/link';

interface RACLinkProps extends Omit<AriaLinkOptions, 'href'> {
  children?: React.ReactNode;
}

const RACLinkComponent = React.forwardRef<HTMLAnchorElement, RACLinkProps>(
  (props, forwardedRef) => {
    const ref = useObjectRef(forwardedRef);

    const { isPressed, linkProps } = useLink(props, ref);
    const { isHovered, hoverProps } = useHover(props);
    const { isFocusVisible, isFocused, focusProps } = useFocusRing(props);

    return (
      <a
        {...mergeProps(
          linkProps,
          hoverProps,
          focusProps,
          { className: '[&.active]:text-green-500 flex items-center gap-1' },
          props
        )}
        ref={ref}
        data-hovered={isHovered || undefined}
        data-pressed={isPressed || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-focused={isFocused || undefined}
      />
    );
  }
);
RACLinkComponent.displayName = 'RACLinkComponent';

const CreatedLinkComponent = createLink(RACLinkComponent);

export const RhinoLink: LinkComponent<typeof RACLinkComponent> = (props) => {
  return <CreatedLinkComponent {...props} />;
};
