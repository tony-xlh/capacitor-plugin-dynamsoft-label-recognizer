//
//  Interoperator.m
//  Plugin
//
//  Created by xulihang on 2023/12/8.
//  Copyright © 2023 Max Lynch. All rights reserved.
//

#import "Interoperator.h"

@implementation Interoperator

- (UIImage*)getUIImage{
    UIImage *image = ((UIImage* (*)(id, SEL))objc_msgSend)(objc_getClass("CameraPreviewPlugin"), sel_registerName("getBitmap"));
    return image;
}

@end
