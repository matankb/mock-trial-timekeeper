import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackOptionsArgs,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { ScreenName } from '../constants/screen-names';
import { RouteProps } from '../Navigation';

type ScreenOptionsArgs<S extends ScreenName> = NativeStackOptionsArgs<
  RouteProps,
  S
>;

type ScreenNavigationOptionsFunction<S extends ScreenName> = (
  args: ScreenOptionsArgs<S>,
) => NativeStackNavigationOptions;

export type ScreenNavigationOptions<S extends ScreenName> =
  | ScreenNavigationOptionsFunction<S>
  | NativeStackNavigationOptions;

export type ScreenProps<S extends ScreenName> = NativeStackScreenProps<
  RouteProps,
  S,
  undefined
>;

export type NavigationProp<S extends ScreenName> = NativeStackNavigationProp<
  RouteProps,
  S,
  undefined
>;
