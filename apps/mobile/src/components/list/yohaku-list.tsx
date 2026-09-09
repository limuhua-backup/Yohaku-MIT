import type { YohakuNoteHeroSpec } from '@modules/yohaku'
import { YohakuNoteHeroHost } from '@modules/yohaku'
import { FlashList } from '@shopify/flash-list'
import type { ReactNode } from 'react'
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { ScrollView, StyleSheet, View } from 'react-native'
import { ScrollViewMarker } from 'react-native-screens/experimental'

import { listPrefetchWindow } from './list-prefetch-window'

const viewabilityConfig = { minimumViewTime: 0, itemVisiblePercentThreshold: 0 }

export type YohakuListItem = { id: string; type: string }

export function YohakuList({
  contentInsetBottom = 0,
  contentInsetTop = 8,
  items,
  noteHero,
  noteHeroMetaColor,
  noteHeroTitleColor,
  refreshing = false,
  renderItem,
  style,
  topEdgeEffectHidden = false,
  onEndReached,
  onRefresh,
  onScroll,
  onVisibleItems,
}: {
  contentInsetBottom?: number
  contentInsetTop?: number
  items: YohakuListItem[]
  noteHero?: YohakuNoteHeroSpec | null
  noteHeroMetaColor?: string
  noteHeroTitleColor?: string
  onEndReached?: () => void
  onRefresh?: () => void
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  onVisibleItems?: (items: YohakuListItem[]) => void
  refreshing?: boolean
  renderItem: (item: YohakuListItem) => ReactNode
  style?: StyleProp<ViewStyle>
  topEdgeEffectHidden?: boolean
}) {
  const list = (
    <FlashList
      contentInset={{ bottom: contentInsetBottom }}
      contentInsetAdjustmentBehavior="automatic"
      data={items}
      getItemType={(item) => item.type}
      keyExtractor={(item) => item.id}
      refreshing={refreshing}
      renderItem={({ item }) => <View>{renderItem(item)}</View>}
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ bottom: contentInsetBottom }}
      style={[styles.fill, style]}
      viewabilityConfig={viewabilityConfig}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: contentInsetTop,
        paddingBottom: 24,
      }}
      renderScrollComponent={
        topEdgeEffectHidden ? HiddenTopScrollView : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      onScroll={onScroll}
      onViewableItemsChanged={({ viewableItems }) =>
        onVisibleItems?.(listPrefetchWindow(items, viewableItems))
      }
    />
  )

  return noteHero ? (
    <YohakuNoteHeroHost
      noteHeroContentInsetTop={contentInsetTop}
      noteHeroCoverPlaceholderUri={noteHero.coverPlaceholderUri}
      noteHeroCoverUri={noteHero.coverUri}
      noteHeroHeight={noteHero.height}
      noteHeroId={noteHero.id}
      noteHeroMeta={noteHero.meta}
      noteHeroMetaColor={noteHeroMetaColor}
      noteHeroRole="list"
      noteHeroTitle={noteHero.title}
      noteHeroTitleColor={noteHeroTitleColor}
      style={[styles.fill, style]}
    >
      {list}
    </YohakuNoteHeroHost>
  ) : (
    list
  )
}

const styles = StyleSheet.create({ fill: { flex: 1 } })

function HiddenTopScrollView(props: ScrollViewProps) {
  return (
    <ScrollViewMarker scrollEdgeEffects={{ top: 'hidden' }} style={styles.fill}>
      <ScrollView {...props} />
    </ScrollViewMarker>
  )
}
