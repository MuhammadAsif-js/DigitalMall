import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PrimaryButton from './PrimaryButton';

describe('PrimaryButton', () => {
  it('renders the title correctly', () => {
    const { getByText } = render(
      <PrimaryButton title="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <PrimaryButton title="Test Button" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('shows ActivityIndicator and hides title when isLoading is true', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <PrimaryButton title="Test Button" onPress={() => {}} isLoading={true} />
    );

    // Using queryByText to verify title is not rendered
    expect(queryByText('Test Button')).toBeNull();

    // Verify ActivityIndicator is rendered by finding the child node type
    const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
  });

  it('does not call onPress and is disabled when isLoading is true', () => {
    const onPressMock = jest.fn();
    const { UNSAFE_getAllByType } = render(
        <PrimaryButton title="Test Button" onPress={onPressMock} isLoading={true} />
    );

    const button = UNSAFE_getAllByType('View').find(view =>
        view.props.accessibilityState && view.props.accessibilityState.disabled === true
    );

    expect(button).toBeDefined();

    // Try to press
    if(button) {
      fireEvent.press(button);
    }
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
