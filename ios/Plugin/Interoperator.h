//
//  Interoperator.h
//  Plugin
//
//  Created by xulihang on 2023/12/8.
//  Copyright © 2023 Max Lynch. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <objc/message.h>
@interface Interoperator : NSObject
- (UIImage*)getUIImage: (NSString *)className methodName: (NSString *)methodName;
@end
