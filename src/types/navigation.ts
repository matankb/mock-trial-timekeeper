import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackOptionsArgs,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RouteProps } from '../Navigation';
import {
  RouteProp,
  useNavigation as useNativeNavigation,
  useRoute as useNativeRoute,
} from '@react-navigation/native';

type ScreenOptionsArgs<S extends keyof RouteProps> = NativeStackOptionsArgs<
  RouteProps,
  S
>;

type ScreenNavigationOptionsFunction<S extends keyof RouteProps> = (
  args: ScreenOptionsArgs<S>,
) => NativeStackNavigationOptions;

export type ScreenNavigationOptions<S extends keyof RouteProps> =
  | ScreenNavigationOptionsFunction<S>
  | NativeStackNavigationOptions;

export type ScreenProps<S extends keyof RouteProps> = NativeStackScreenProps<
  RouteProps,
  S,
  undefined
>;

export type NavigationProp<S extends keyof RouteProps> =
  NativeStackNavigationProp<RouteProps, S, undefined>;

export const useNavigation = useNativeNavigation<
  NavigationProp<keyof RouteProps>
>;
export const useRoute = <S extends keyof RouteProps>() => {
  return useNativeRoute<RouteProp<RouteProps, S>>();
};
