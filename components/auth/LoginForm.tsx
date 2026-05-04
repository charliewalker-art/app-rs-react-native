import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";

type Props = {
  username: string;
  password: string;
  loading: boolean;
  onChangeUsername: (val: string) => void;
  onChangePassword: (val: string) => void;
  onSubmit: () => void;
};

export default function LoginForm({
  username, password, loading, onChangeUsername, onChangePassword, onSubmit
}: Props) {
  return (
    <View className="flex-1 bg-gray-900 items-center justify-center px-8">

      {/* Logo / Titre */}
      <View className="items-center mb-10">
        <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-4">
          <Text className="text-white text-3xl">🛡</Text>
        </View>
        <Text className="text-white text-3xl font-bold">Poste Web</Text>
        <Text className="text-gray-400 text-sm mt-2">Connectez-vous pour continuer</Text>
      </View>

      {/* Champ utilisateur */}
      <View className="w-full mb-4">
        <Text className="text-gray-400 text-xs mb-2 uppercase tracking-widest">Utilisateur</Text>
        <TextInput
          value={username}
          onChangeText={onChangeUsername}
          placeholder="Nom d'utilisateur"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          className="bg-gray-800 text-white rounded-xl px-4 py-4 text-sm border border-gray-700 w-full"
        />
      </View>

      {/* Champ mot de passe */}
      <View className="w-full mb-8">
        <Text className="text-gray-400 text-xs mb-2 uppercase tracking-widest">Mot de passe</Text>
        <TextInput
          value={password}
          onChangeText={onChangePassword}
          placeholder="Mot de passe"
          placeholderTextColor="#6b7280"
          secureTextEntry
          className="bg-gray-800 text-white rounded-xl px-4 py-4 text-sm border border-gray-700 w-full"
        />
      </View>

      {/* Bouton connexion */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={loading}
        className="bg-blue-600 w-full py-4 rounded-2xl items-center"
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text className="text-white font-bold text-base">Se connecter</Text>
        }
      </TouchableOpacity>
    </View>
  );
}