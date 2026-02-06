import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { FC } from "react";
import { ActivityIndicator, View } from "react-native";

import colors from "../../constants/colors";
import { Trial } from "../../controllers/trial";
import { useUploadTrial } from "../../hooks/useUploadTrial";
import Link from "../Link";

interface UploadLinkProps {
  trial: Trial;
}

const UploadLink: FC<UploadLinkProps> = ({ trial }) => {
  const { handleUpload, uploading } = useUploadTrial({ trial });

  return (
    <Link
      rightIcon={<MaterialIcons name="people" size={24} color={colors.GREEN} />}
      icon={uploading
        ? (
          <View
            style={{
              width: 24,
              height: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="small" color={colors.GREEN} />
          </View>
        )
        : <Feather name="upload-cloud" size={22} color={colors.GREEN} />}
      title="Upload to Team Account"
      onPress={handleUpload}
    />
  );
};

export default UploadLink;
