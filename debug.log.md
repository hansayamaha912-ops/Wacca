タイトル：iCloud同期ロックに起因するビルドエラーの解消記録
【事象】
npm install がタイムアウトまたはフリーズする。

ブラウザで ReferenceError や SyntaxError が頻発するが、コード自体には不備が見当たらない。

ファイルに「同期待ち」のアイコンが表示され、エディタでの保存が反映されない。

【原因】
プロジェクトが ~/Desktop（iCloud同期対象）内にあったため。

node_modules 内の膨大な小ファイルがiCloudの同期プロセスによってロックされ、Viteやnpmからのアクセスが拒否されていた。

【解決策】
ディレクトリの隔離:
rsync を使用し、node_modules を除外したプロジェクト一式を ~/Developer/Wacca（非同期領域）へ避難。

環境の再構築:
隔離先で npm install を実行（29秒で完了）。

AIエージェントの同期:
Antigravity (Cline) のワークスペース権限を新しいディレクトリへ更新。

コードの整合性確認:
groupRef の定義漏れを修正し、iCloud環境下で発生していた「偽の構文エラー」が解消されたことを確認。

【教訓】
Web開発、特にファイル数が多いReact/Hydrogenプロジェクトは、iCloud DriveやOneDriveの同期対象フォルダ内に置いてはいけない。
